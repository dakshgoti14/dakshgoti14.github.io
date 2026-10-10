// Removes the background from a portrait using macOS Vision's foreground-subject mask, entirely on
// this machine (nothing is uploaded). Usage: swift scripts/cutout.swift <input.jpg> <output.png>
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3 else { fatalError("usage: cutout.swift <input> <output.png>") }
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

guard let source = CIImage(contentsOf: input, options: [.applyOrientationProperty: true]) else { fatalError("cannot read \(input.path)") }
let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: source)
try handler.perform([request])
guard let result = request.results?.first else { fatalError("no subject found") }

// Masked image at full resolution, not cropped to the subject, so framing stays as photographed.
let masked = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
let ci = CIImage(cvPixelBuffer: masked)
let context = CIContext()
guard let cg = context.createCGImage(ci, from: ci.extent) else { fatalError("render failed") }
let rep = NSBitmapImageRep(cgImage: cg)
guard let png = rep.representation(using: .png, properties: [:]) else { fatalError("png encode failed") }
try png.write(to: output)
print("wrote \(output.path) \(cg.width)x\(cg.height)")

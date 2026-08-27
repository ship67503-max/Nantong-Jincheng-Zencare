param(
  [int]$Parallel = 4
)

$ErrorActionPreference = 'Stop'
$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$python = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$generator = 'C:\Users\Administrator\.codex\skills\nomiss-generate-images\scripts\generate_image.py'
$basePrompt = 'Ultra realistic commercial photography for a premium European and North American B2B OEM manufacturing website. Clean professional lighting, precise materials, restrained neutral palette, landscape composition, no people unless only natural hands are essential, no factory scene, no logo, no brand name, no watermark, no readable text, no labels, no typography.'

$tasks = @(
  @('pet-training-pads/pet-training-pad-main.jpg', 'Hero product photo of stacked white disposable puppy training pads plus one fully unfolded rectangular pad, subtle pale blue edge, seamless light gray-white studio background, three-quarter angle, catalog-quality material accuracy.'),
  @('pet-training-pads/pet-training-pad-home.jpg', 'Modern bright Western home interior, a clean white disposable puppy training pad placed naturally near a pet care area, one healthy golden retriever puppy nearby, no humans, realistic everyday use, product clearly visible.'),
  @('pet-training-pads/pet-training-pad-detail.jpg', 'Extreme macro product photograph of a disposable puppy pad corner, showing soft diamond-embossed nonwoven surface, neat heat-sealed edge, subtle absorbent core thickness and waterproof backing, shallow depth of field.'),
  @('pet-training-pads/pet-training-pad-structure.jpg', 'Photorealistic exploded cutaway product visualization of one disposable puppy pad with exactly five clearly separated physical layers floating in order: white nonwoven top, thin tissue, granular SAP absorbent layer, fluffy cellulose pulp, pale blue PE waterproof film, no arrows or labels.'),
  @('pet-training-pads/pet-training-pad-package.jpg', 'Private-label-ready packaging presentation for disposable puppy pads: unbranded matte white flexible retail bag with a small transparent window beside neatly folded pads and a plain export carton, no markings or text.'),

  @('adult-underpads/adult-underpad-main.jpg', 'Hero product photo of premium adult disposable underpads, one unfolded rectangular white underpad with pale blue waterproof edge plus a neat folded stack, seamless white studio background, clinical but warm premium catalog styling.'),
  @('adult-underpads/adult-underpad-home-care.jpg', 'Calm bright Western home-care bedroom, immaculate made bed with one disposable underpad visibly and naturally positioned on top, warm daylight, no patient, no caregiver, respectful clinical realism.'),
  @('adult-underpads/adult-underpad-core-detail.jpg', 'Extreme macro cutaway of an adult underpad absorbent core, visible soft nonwoven, white tissue, fluffy cellulose pulp and fine absorbent polymer granules, precise hygienic material detail, no liquid splash.'),
  @('adult-underpads/adult-underpad-size.jpg', 'Three adult disposable underpads arranged flat from small to large on a clean neutral studio floor, proportional size comparison using composition only, no rulers, no dimensions, no arrows, no labels.'),
  @('adult-underpads/adult-underpad-package.jpg', 'Premium unbranded adult underpad packaging concept, matte white and soft blue retail bag without text beside folded underpads and a plain shipping carton, professional healthcare distributor catalog photo.'),

  @('pet-absorbent-paper/pet-absorbent-paper-main.jpg', 'Hero product photograph of white absorbent paper material supplied as broad rolls and neatly cut sheets, clean industrial studio table, precise fibrous material, soft side lighting, factory-direct B2B catalog composition.'),
  @('pet-absorbent-paper/pet-absorbent-paper-pet-care.jpg', 'Bright modern pet care setting showing an unbranded absorbent paper sheet being placed beneath a clean pet hygiene setup, small dog nearby, no people, material and practical application clearly visible.'),
  @('pet-absorbent-paper/pet-absorbent-paper-material.jpg', 'Extreme macro commercial photograph of absorbent paper fibers and layered porous texture with a controlled clear moisture bead being drawn into the material, scientifically credible, clean laboratory lighting.'),
  @('pet-absorbent-paper/pet-absorbent-paper-roll-package.jpg', 'B2B supply presentation of large pristine absorbent paper rolls with protective clear wrapping, cut sheets stacked beside them, plain kraft shipping cartons and pallet edge, no factory background, no text.'),
  @('pet-absorbent-paper/pet-absorbent-paper-application.jpg', 'Clean converting workbench with absorbent paper roll feeding into a partially assembled disposable pet pad, product materials organized precisely, no operator, no fake factory, premium technical application photography.'),

  @('disposable-cleaning-products/disposable-cleaning-products-pet-care.jpg', 'Natural pet care scene in a bright modern Western home, only a real human hand gently using a plain white disposable cleaning mitt on a healthy dog paw, no face or full person, hygienic and authentic.'),
  @('disposable-cleaning-products/disposable-cleaning-products-package.jpg', 'Unbranded retail packaging presentation for disposable pet cleaning wipes and mitts, matte white resealable pouch and simple box with no printing, product samples arranged beside plain export carton.'),
  @('disposable-cleaning-products/disposable-cleaning-products-use.jpg', 'Modern home entryway after a dog walk, disposable white pet cleaning wipe and mitt arranged beside a clean pet towel and leash, healthy dog nearby, no people, practical use scene, product visible.'),
  @('disposable-cleaning-products/disposable-cleaning-products-detail.jpg', 'Extreme macro product detail of premium disposable pet cleaning nonwoven material, showing soft embossed texture, clean bonded edge, flexible fiber structure and realistic thickness, neutral studio lighting.')
)

$outputRoot = Join-Path $workspaceRoot 'public\images\products'
$pending = foreach ($task in $tasks) {
  $outputPath = Join-Path $outputRoot $task[0]
  if (-not (Test-Path -LiteralPath $outputPath)) {
    New-Item -ItemType Directory -Path (Split-Path $outputPath -Parent) -Force | Out-Null
    [PSCustomObject]@{ Output = $outputPath; Prompt = "$basePrompt $($task[1])" }
  }
}

for ($offset = 0; $offset -lt $pending.Count; $offset += $Parallel) {
  $end = [Math]::Min($offset + $Parallel - 1, $pending.Count - 1)
  $batch = @($pending[$offset..$end])
  $jobs = foreach ($task in $batch) {
    Start-Job -ScriptBlock {
      param($PythonPath, $GeneratorPath, $Prompt, $Output)
      & $PythonPath $GeneratorPath --prompt $Prompt --output $Output --size 1536x1024 --quality high --format jpeg --timeout 300
      if ($LASTEXITCODE -ne 0) { throw "Image generation failed for $Output" }
    } -ArgumentList $python, $generator, $task.Prompt, $task.Output
  }
  $jobs | Wait-Job | Receive-Job
  $jobs | Remove-Job
}

Write-Output "Generated $($pending.Count) product images in $outputRoot"

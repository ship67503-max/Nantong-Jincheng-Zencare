#target photoshop

app.displayDialogs = DialogModes.NO;
var inputDir = new Folder('C:/Users/Administrator/Documents/独立站修改/work/native-crops');
var outputDir = new Folder('C:/Users/Administrator/Documents/独立站修改/work/photoshop-native-upscaled');
if (!outputDir.exists) outputDir.create();

var files = inputDir.getFiles(function (file) {
  return file instanceof File && /\.png$/i.test(file.name);
});

for (var i = 0; i < files.length; i++) {
  var doc = app.open(files[i]);
  var width = doc.width.as('px') * 6;
  var height = doc.height.as('px') * 6;
  try {
    doc.resizeImage(UnitValue(width, 'px'), UnitValue(height, 'px'), null, ResampleMethod.PRESERVEDETAILS2);
  } catch (error) {
    doc.resizeImage(UnitValue(width, 'px'), UnitValue(height, 'px'), null, ResampleMethod.BICUBICSHARPER);
  }
  var baseName = files[i].name.replace(/\.png$/i, '');
  var outputFile = new File(outputDir.fsName + '/' + baseName + '.png');
  var pngOptions = new PNGSaveOptions();
  pngOptions.compression = 9;
  doc.saveAs(outputFile, pngOptions, true, Extension.LOWERCASE);
  doc.close(SaveOptions.DONOTSAVECHANGES);
}

app.displayDialogs = DialogModes.ALL;

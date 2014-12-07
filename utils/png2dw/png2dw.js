var fs = require('fs');
var PNG = require('png-js');

var png = PNG.load(process.argv[2]);

if (png.width % 16 !== 0 || png.height % 16 !== 0) return console.error('Size must be divisible by 16');

var bytes_per_row = png.width * 4;
var basename = process.argv[3] || 'sprite';

png.decode(function (pixels) { // Assumes rgba[]
	var sprite_per_rows = png.height / 16;
	var sprite_per_cols = png.width / 16;
	var sprites = '';

	for (var r = 0; r < sprite_per_rows; ++r) {
	 	for (var c = 0; c < sprite_per_cols; ++c) {
			sprites += extract16x16(r * 16, c * 16, pixels, basename + '_' + r + '_' + c) + '\n';
	 	}
	}

	console.log(sprites);
});

function extract16x16(start_row, start_col, pixels, name) {
	var sprite_string = name + ':\n';

	for (var r = start_row; r < (start_row + 16); ++r) {
		var dw_string = 'dw $';

		for (var c = start_col; c < (start_col + 16); ++c) {
			var r_comp = pixels[r * bytes_per_row + c * 4];
			dw_string += r_comp < 128 ? '1' : '.';
		}

		sprite_string += dw_string + '\n';		
	}

	return sprite_string;
}
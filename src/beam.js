// Code modified from http://codegolf.stackexchange.com/a/57190
var Beam = {
	run: function (code, input, MAX_ITERS) {
		if (typeof code === "undefined") throw Error("Beam.run() must have at least one input");
		if (typeof input === "undefined") input = "";
		
		var store, beam, ip_x, ip_y, dir, input_ptr, mem;
		var width, iterations, running;
		
		code = code.split("\n");
		width = 0;
		for (var i = 0; i < code.length; ++i){
			if (code[i].length > width){ 
				width = code[i].length;
			}
		}

		running = true;
		dir = 0;
		ip_x = 0;
		ip_y = 0;
		input_ptr = 0;
		beam = 0;
		store = 0;
		mem = [];

		input = input.split("").map(function (s) {
			return s.charCodeAt(0);
		});

		iterations = 0;
		
		while (running) {
			var inst;
			try {
				inst = code[ip_y][ip_x];
			}
			catch(err) {
				inst = "";
			}
			switch (inst) {
				case ">":
					dir = 0;
					break;
				case "<":
					dir = 1;
					break;
				case "^":
					dir = 2;
					break;
				case "v":
					dir = 3;
					break;
				case "+":
					if(++beam > 255)
						beam = 0;
					break;
				case "-":
					if(--beam < 0)
						beam = 255;
					break;
				case "@":
					process.stdout.write(String.fromCharCode(beam));
					break;
				case ":":
					process.stdout.write(String(beam));
					break;
				case "/":
					dir ^= 2;
					break;
				case "\\":
					dir ^= 3;
					break;
				case "!":
					if (beam != 0) {
						dir ^= 1;
					}
					break;
				case "?":
					if (beam == 0) {
						dir ^= 1;
					}
					break;
				case "_":
					switch (dir) {
					case 2:
						dir = 3;
						break;
					case 3:
						dir = 2;
						break;
					}
					break;
				case "|":
					switch (dir) {
					case 0:
						dir = 1;
						break;
					case 1:
						dir = 0;
						break;
					}
					break;
				case "H":
					running = false;
					break;
				case "S":
					store = beam;
					break;
				case "L":
					beam = store;
					break;
				case "s":
					mem[beam] = store;
					break;
				case "g":
					store = mem[beam];
					break;
				case "P":
					mem[store] = beam;
					break;
				case "p":
					beam = mem[store];
					break;
				case "u":
					if (beam != store) {
						dir = 2;
					}
					break;
				case "n":
					if (beam != store) {
						dir = 3;
					}
					break;
				case "`":
					--store;
					break;
				case "'":
					++store;
					break;
				case ")":
					if (store != 0) {
						dir = 1;
					}
					break;
				case "(":
					if (store != 0) {
						dir = 0;
					}
					break;
				case "r":
					if (input_ptr >= input.length) {
						beam = 0;
					} else {
						beam = input[input_ptr];
						++input_ptr;
					}
					break;
				}
			// Move instruction pointer
			switch (dir) {
				case 0:
					ip_x++;
					break;
				case 1:
					ip_x--;
					break;
				case 2:
					ip_y--;
					break;
				case 3:
					ip_y++;
					break;
			}
			if (running && (ip_x < 0 || ip_y < 0 || ip_x >= width || ip_y >= code.length)) {
				running = false;
			}
			++iterations;
			if (iterations > Beam.MAX_ITERS) {
				running = false;
			}
		}
	}
};

module.exports = Beam;

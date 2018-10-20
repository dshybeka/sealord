var GAME =
{
	renderer : null,
	camera : null,
	scene : null,
	controls : null,
	ocean : null,

	commands : {
		states : {
			up : false,
			right : false,
			down : false,
			left : false
		},
		movements : {
			speed : 0.0,
			angle : 0.0
		}
	}
}
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var nprTitleSchema = new Schema({
	title: {
		type: String,
		required: true
	}
});

var titleModel = ('Title', nprTitleSchema);

module.exports(titleModel);
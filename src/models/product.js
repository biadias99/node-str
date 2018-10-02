'use strict';

const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true, 
        trim: true //remover os espaços em branco
    },// não precisa colocar id, mongoose coloca _id
    slug: { // Cadeira Gamer = cadeira-gamer
        type: String,
        required: [true, 'O slug é obrigatório'], 
        trim: true,
        index: true, 
        unique: true
    },
    description: {
        type: String,
        required: true, 
        trim: true
    },
    price: {
        type: Number,
        required: true, 
    },
    active: {
        type: Boolean,
        required: true, 
        default: true,
    },
    tags: [{
        type: String,
        required: true
    }],
    // image: {
    //     type: String, 
    //     required: true,
    //     trim: true
    // }
});

module.exports = mongoose.model('Product', schema);

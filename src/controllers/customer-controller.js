'use strict';

const ValidationContract = require('../validators/validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
        res.status(200).send(data); 
    }catch (e){
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.post = async(req, res, next) => {
    // o contrato existe para não fazer ifs aqui
    let contract = new ValidationContract();
    contract.isEmail(req.body.email, 'O email deve ser válido');
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    // Se os dados forem inválidos
    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try{
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY) // só a senha daria certo mas para ser mais seguro, coloco uma chave
        });
        res.status(200).send({ message: 'Cliente cadastrado com sucesso!' });  
    }catch (e){
        res.status(500).send({
            message: 'Erro no cadastro do cliente!'
        });
    }
};
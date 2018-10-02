'use strict';

const ValidationContract = require('../validators/validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

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

exports.authenticate = async(req, res, next) => {
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
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY) // só a senha daria certo mas para ser mais seguro, coloco uma chave
        });
        
        if(!customer){
            res.status(404).send({
                message: 'Usuário ou senha inválidos!'
            });
            return;
        }
        const token = await authService.generateToken({ 
            id: customer._id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        });        
        res.status(201).send({ 
            token: token,
            data: {
                email: customer.email,
                name: customer.name,
            }
        });  
    }catch (e){
        res.status(500).send({
            message: 'Erro na autenticação do cliente!'
        });
    }
};

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
            password: md5(req.body.password + global.SALT_KEY), // só a senha daria certo mas para ser mais seguro, coloco uma chave
            roles: ["user"]
        });

        emailService.send(req.body.email, 'Bem-vindo ao Node Store', global.EMAIL_TMPL.replace('{0}', req.body.name));
        
        res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });  
    }catch (e){
        res.status(500).send({
            message: 'Erro no cadastro do cliente!'
        });
    }
};

exports.refreshToken = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);
    
        const customer = await repository.getById(data.id);
        
        if(!customer){
            res.status(404).send({
                message: 'Usuário ou senha inválidos!'
            });
            return;
        }
        const tokenData = await authService.generateToken({ 
            id: customer._id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        });        
        res.status(201).send({ 
            token: tokenData,
            data: {
                email: customer.email,
                name: customer.name,
            }
        });  
    }catch (e){
        res.status(500).send({
            message: 'Erro na autenticação do cliente!'
        });
    }
};
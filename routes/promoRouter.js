const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const Promotions = require('../models/promotions');
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((Promotions)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(Promotions)
    }, (err) => next(err))
    .catch((err)=>next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
    .then((Promotion)=>{
        console.log("Data Entered", leader)
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(Promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.remove()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((Promotion)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(Promotion)
    }, (err) => next(err))
    .catch((err)=>next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
res.statusCode = 403;
res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((Promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;
/*
 * (C) Copyright 2014 Travis Miller (http://raceconditions.net/).
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 */

var Datastore = require('nedb');

var Db = function() {

    var self = this;
    var db = {};
    db.moisture = new Datastore({ filename: 'data/moisture.db', autoload: true, timestampData: true }),
    db.watering = new Datastore({ filename: 'data/watering.db', autoload: true, timestampData: true }),
    db.config = new Datastore({ filename: 'data/config.db', autoload: true, timestampData: true });
    db.events = new Datastore({ filename: 'data/events.db', autoload: true, timestampData: true });
    db.temperature = new Datastore({ filename: 'data/temperature.db', autoload: true, timestampData: true });

    db.moisture.ensureIndex({ fieldName: 'createdAt', expireAfterSeconds: 7890000 }, function(err) { if(err) console.log(err); });
    db.watering.ensureIndex({ fieldName: 'createdAt', expireAfterSeconds: 7890000 }, function(err) { if(err) console.log(err); });
    db.events.ensureIndex({ fieldName: 'createdAt', expireAfterSeconds: 7890000 }, function(err) { if(err) console.log(err); });
    db.temperature.ensureIndex({ fieldName: 'createdAt', expireAfterSeconds: 7890000 }, function(err) { if(err) console.log(err); });


console.log("db ready");
/*
    db.config.find({category: "master"}, function(err, docs) {
        if(docs.length < 1) { console.log("seeding");
            db.config.insert({
                category: "master",
                sensorCount: 5, 
                sensorPollingFrequency: 1800000, 
                autoWatering: true, 
                autoWateringThreshold: 1, 
                autoWateringDuration: 60000,
                autoWateringIntervalWaitTime: 86400000,
                moistureDeviationFactor: 1
            });
        } else {
            console.log("config already seeded");
        }
    });
*/

    this.saveConfig = function(category, config) {
        console.log("Category: " + category);
        console.log(config);
        db.config.update({category: category}, config, {}, function (err, numReplaced) {
        console.log("Updated: " + numReplaced);
    })};

    this.getConfig = function(category, callback) {
        db.config.findOne({category: category}, function(err, docs) {
            return callback(docs);
        });
    };

    this.saveSensorValues = function(dataPoint) {
        db.moisture.insert(dataPoint);
    };

    this.getSensorValues = function(date, callback) {
        db.moisture.find({createdAt: {$gte: date}}).sort({createdAt: 1}).exec(function(err, docs) {
             return callback(docs);
        });
    };

    this.getLastSensorValue = function(callback) {
        db.moisture.findOne({}).sort({createdAt: -1}).exec(function(err, doc) {
             return callback(doc);
        });
    };

    this.saveTemperatureValues = function(dataPoint) {
        db.temperature.insert(dataPoint);
    };

    this.getTemperatureValues = function(date, callback) {
        db.temperature.find({createdAt: {$gte: date}}).sort({createdAt: 1}).exec(function(err, docs) {
             return callback(docs);
        });
    };

    this.getLastTemperatureValue = function(callback) {
        db.temperature.findOne({}).sort({createdAt: -1}).exec(function(err, doc) {
             return callback(doc);
        });
    };

    this.saveWatering = function(data) {
        db.watering.insert(data);
    };

    this.getLastWatering = function(callback) {
        db.watering.findOne({}).sort({createdAt: -1}).exec(function(err, docs) {
            return callback(docs);
        });
    };

    this.getWaterings = function(date, callback) {
        db.watering.find({createdAt: {$gte: date}}).sort({createdAt: 1}).exec(function(err, docs) {
             return callback(docs);
        });
    };

    this.saveEvent = function(event) {
        db.events.insert(event);
    };

    this.getEvents = function(date, callback) {
        db.events.find({createdAt: {$gte: date}}).sort({createdAt: 1}).exec(function(err, docs) {
             return callback(docs);
        });
    };

};

module.exports = new Db();

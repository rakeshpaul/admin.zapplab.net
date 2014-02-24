/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,
  tableName: 'User',
  
  attributes: {

    name: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    active: {
      type: 'boolean',
      defaultsTo: false
    },

    activationKey: {
      type: 'string'
    },

    admin: {
      type: 'boolean',
      defaultsTo: false
    }

  }

};

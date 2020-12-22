const mongoose = require('mongoose')

const permissionSchema = mongoose.Schema({
  staffId:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    }
  ,

  staff: {
    edit: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: false
    },
    view:{
      type: Boolean,
      default: false
    },
  },

  station: {
    edit:[{
      type: String,
    }],
    add:{
      type: Boolean,
      default: false
    },
  },

  timesheet:{
    view: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station'
    }],

    sign:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station'
    }]
  },

  admin: {
    type: Boolean,
    default: false
  },

})
module.exports = mongoose.model('Permission',permissionSchema)
const models = require('../models')
const Validator = require('fastest-validator')
const checkAuthMw = require('../middleware/check_auth')
const multer = require('multer')



// Post an event
function addEvent(req, res) {
  //  const url = req.protocol + '://' + req.get('host');
    //req.body.imageUrl = url + '/uploads/' + req.file.filename;
    
    const event = {
        eventName: req.body.eventName,
        eventOrganizer: req.body.eventOrganizer,
        location: req.body.location,
        description: req.body.description,
        eventDate: req.body.eventDate,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        userId: req.userData.userId
    }

    // define validation schema
    const schema = {
        eventName: {type: 'string', optional:'false', max:'100'},
        eventOrganizer: {type: 'string', optional:'false', max:'50'},
        description: {type: 'string', optional:'false', max:'500'},
        eventDate: {type: 'string', optional:'false', max:'100'},
    }

    // Create new validator class instance with method validate() - pass fields object and validation schema
    const v = new Validator()
    const validationResponse = v.validate(event, schema)

    // if validated passes return true else return error
    if(validationResponse != true){
        return res.status(400).json({
            message: 'validation failed!',
            errors: validationResponse
        })
    }

    models.Event.create(event).then(result => {
        res.status(201).json({
            message: 'Event created successfully',
            event: result
        }).catch(err => {
            res.status(500).json({
                message: 'Something went wrong',
                error: err
            })
        })
    })
}

// Get one event
function getEventsById(req, res) {
    const id = req.params.id

    models.Event.findByPk(id).then(result => {
       if(result){
        res.status(200).json(result)
       } else {
        res.status(404).json({
            message: 'Event not found'
        })
       }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    })
}

// Get events from specific users
function getByUID(req, res) {
    const uid = req.userData.userId

    models.Event.findAll({
        where: {userId: uid}
    }).then(result => {
       if(result){
        res.status(200).json(result)
       } else {
        res.status(404).json({
            message: 'Event not found'
        })
       }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    })
}

// Get events from category
function getByCategory(req, res) {
    const cat = req.params.categoryId

    models.Event.findAll({
        where: {categoryId: cat}
    }).then(result => {
       if(result){
        res.status(200).json(result)
       } else {
        res.status(404).json({
            message: 'Event not found'
        })
       }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    })
}




// Get all events
function getAllEvents(req, res){
    models.Event.findAll().then(result => {
        if(result){
            res.status(200).json(result)
           } else {
            res.status(404).json({
                message: 'No events added'
            })
           }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    })
}

// Update events
function updateEvent(req, res){
    const id = req.params.id
    const updatedEvent = {
        eventName: req.body.eventName,
        eventOrganizer: req.body.eventOrganizer,
        location: req.body.location,
        description: req.body.description,
        eventDate: req.body.eventDate,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
    }

    // no users yet
    const userId = req.userData.userId

        // define validation schema
        const schema = {
            eventName: {type: 'string', optional:'false', max:'100'},
            eventOrganizer: {type: 'string', optional:'false', max:'50'},
            description: {type: 'string', optional:'false', max:'500'},
            //categoryId: {type: 'number', optional:'false'},
            eventDate: {type: 'string', optional:'false', max:'100'},
        }
    
        // Create new validator class instance with method validate() - pass fields object and validation schema
        const v = new Validator()
        const validationResponse = v.validate(updatedEvent, schema)
    
        // if validated passes return true else return error
        if(validationResponse != true){
            return res.status(400).json({
                message: 'validation failed!',
                errors: validationResponse
            })
        }
    

    models.Event.update(updatedEvent, {where: {id:id, userId: userId}}).then(result => {
        res.status(200).json({
            message: "Event Updated",
            event: updatedEvent
        })
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    })
}


// Delete event
function deleteEvent(req, res){
    const id = req.params.id;
    const userId = req.userData.userId;

    models.Event.destroy({where:{id:id, userId:userId}}).then(() => {
        res.status(200).json({
            message: "Post deleted successfully"
        });
        
    }).catch(err => {
        res.status(200).json({
            message: "Something went wrong",
            error: err
        });
    });
}

module.exports = {
    addEvent:addEvent,
    getEventsById:getEventsById,
    getAllEvents:getAllEvents,
    updateEvent:updateEvent,
    deleteEvent: deleteEvent,
    getByUID:getByUID,
    getByCategory:getByCategory
}
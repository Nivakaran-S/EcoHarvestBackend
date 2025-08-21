
Naming convention --> 
e.g., vendors.router.js - if the file is a router
        vendors.controller.js - if the file is a controller
        vendors.model.js - if the file a a model


There should be a controller file for a router file
A router uses a controller (one to one relationship)
So we are keeping the controllers and routers in the same file
Models are kept in a seprate folder cuz some controllers can be use multiple models
(Modals and controllers do not have a one to one relationship)
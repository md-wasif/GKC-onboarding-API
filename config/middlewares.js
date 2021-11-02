// add all route that will not use the verifyToken middleware here
// Incase you don't want to use any middleware, assign empty string (path: '')
// In case you want to use multiple middlwares, assign comma-separated names of middlewares (path: 'middleware1,middleware2')



module.exports = {
    'register': '',
    'login': '',
    'logout': '',
    'createUser/*': '',
    'getUser/*': '',
    'editUser/*': '',
    'getUsers/*': '',
    'deactivateUser/*': '',
    'getCuisines/*': '',
    'getBrands/*': '',
    'getProducts/*': '',
    'createBrand/*': '',
    'getAllBrand/*': '',






    
    '*': 'verifyToken'
}
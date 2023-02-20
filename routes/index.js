const { Router } = require("express");
const router = Router()
const checkAuth = require("../middleware/auth")
const checkRoleAuth = require("../middleware/rol")
const Img = require("../models/img");
const upload = require("../middleware/upload");
//Controlador img
const {
    getImg,
    createImg,
    deleteImg,
    getImgById,
    updateImg
} = require("../controllers/img");

const {
    uploadToCloudinary,
} = require("../services/cloudinary");

// Controladores Tipo Servicio
const {
    createTipoServicio,
    getTipoServicioById,
    getAllTipoServicios,
    deleteTipoServicio,
    updateTipoServicio
} = require("../controllers/tipo_servicio");

// Controladores Servicio
const {
    createServicio,
    getServicioById,
    getAllServicios,
    deleteServicio,
    updateServicio
} = require("../controllers/servicio");

// Controladores Detalle Servicio
const {
    createDetalleServicio,
    getDetalleServicioById,
    getAllDetalleServicios,
    deleteDetalleServicio,
    updateDetalleServicio
} = require("../controllers/detalle_servicio");

// Controlador Alquiler
const {
    createAlquiler,
    getAllAlquiler,
    getAlquilerById,
    updateAlquiler,
    deleteAlquiler
} = require('../controllers/alquiler')

// Controlador Bien
const {
    createBien,
    getAllBien,
    getBienById,
    updateBien,
    deleteBien
} = require('../controllers/bien')


// Controlador Departamento
const {
    createDepartamento,
    getAllDepartamento,
    getDepartamentoById,
    updateDepartamento,
    deleteDepartamento
} = require('../controllers/departamento')

// Controlador Detalle Cuota
const {
    getAllDCuota,
    getByDCuota,
    createDCuota,
    updateDCuota,
    deleteDCuota
} = require("../controllers/detalle_cuota");

// Controlador Multa
const {
    getAllMulta,
    getByMulta,
    createMulta,
    updateMulta,
    deleteMulta
} = require("../controllers/multa");

// Controlador Persona
const {
    createPersona,
    // getPersona,
    getAllPersona,
    deletePersona,
    // updatePersona
} = require("../controllers/persona");

//Controlador Residente
const {
    createResidente,
    getResidente,
    getAllResidente,
    deleteResidente,
    updateResidente
} = require("../controllers/residente");

//Controlador auth
const {
    loginCtrl
} = require("../controllers/auth")

// auth
router.post('/auth', loginCtrl)

// Controlador Rol Residente
const {
    createRolResidente,
    getRolResidenteById,
    getAllRolResidentes,
    deleteRolResidente,
    updateRolResidente
} = require("../controllers/RolResidente");

// Controlador Usuario Externo
const {
    createUsuarioExterno,
    getUsuarioExterno,
    getAllUsuarioExterno,
    deleteUsuarioExterno,
    updateUsuarioExterno
} = require("../controllers/usuario_externo");

//Controlador Vehículo
const {
    getAllVehiculo,
    getVehiculoById,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo
} = require("../controllers/vehiculo");

//Controlador Reporte
const {
    getAllReporte,
    getReporteById,
    createReporte,
    updateReporte,
    deleteReporte
} = require("../controllers/reporte");

//Controlador Pagos
const {
    createCuota,
    getAllAlicuota,
    getAllCuota,
    getAllDetallePago,
    createDetallePago,
    getPagoByaliID,
    updatePago,
    updateAlicuota,
    deleteAliCuota,
    deletePago,
    createPagoByID,
    updateEstado
} = require("../controllers/pago");

// Tipo Servicio CRUD
router.post('/tipo_servicio', createTipoServicio)
router.get('/tipo_servicio/:tser_id', getTipoServicioById)
router.get('/tipo_servicios', getAllTipoServicios)
router.delete('/tipo_servicio/:tser_id', deleteTipoServicio)
router.put('/tipo_servicio/:tser_id', updateTipoServicio)

// Servicio CRUD
router.post('/servicio', createServicio)
router.get('/servicio/:ser_id', getServicioById)
router.get('/servicios', getAllServicios)
router.delete('/servicio/:ser_id', deleteServicio)
router.put('/servicio/:ser_id', updateServicio)
module.exports = router

// Detalle Servicio CRUD
router.post('/detalle_servicio', createDetalleServicio)
router.get('/detalle_servicio/:dser_id', getDetalleServicioById)
router.get('/detalle_servicios', getAllDetalleServicios)
router.delete('/detalle_servicio/:dser_id', deleteDetalleServicio)
router.put('/detalle_servicio/:dser_id', updateDetalleServicio)

// Alquiler CRUD
router.post('/alquileres/', createAlquiler)
router.get('/alquileres', getAllAlquiler)
router.get('/alquileres/alq_id/:alq_id', getAlquilerById)
router.put("/alquileres/:alq_id", updateAlquiler)
router.delete('/alquileres/:alq_id', deleteAlquiler)

// Bien CRUD
router.post('/bienes/', createBien)
router.get('/bienes', getAllBien)
router.get('/bienes/bien_id/:bien_id', getBienById)
router.put("/bienes/:bien_id", updateBien)
router.delete('/bienes/:bien_id', deleteBien)



// Departamento CRUD
router.post('/departamentos/', createDepartamento)
router.get('/departamentos', getAllDepartamento)
router.get('/departamentos/dep_id/:dep_id', getDepartamentoById)
router.put("/departamentos/:dep_id", updateDepartamento)
router.delete('/departamentos/:dep_id', deleteDepartamento)

// Detalle Cuota CRUD
router.get('/dcuota', getAllDCuota)
router.get('/dcuota/:dcuo_id', getByDCuota)
router.post('/dcuota', createDCuota)
router.put("/dcuota/:dcuo_id", updateDCuota)
router.delete('/dcuota/:dcuo_id', deleteDCuota)

// Multa CRUD
router.get('/multa', getAllMulta)
router.get('/multa/:mul_id', getByMulta)
router.post('/multa', createMulta)
router.put("/multa/:mul_id", updateMulta)
router.delete('/multa/:mul_id', deleteMulta)

// Persona CRUD
router.post('/Persona', createPersona)
    // router.get('/Persona/:rol_id', getPersona)
router.get('/Persona', getAllPersona)
router.delete('/Persona/:per_id', deletePersona)
    // router.put('/Persona/:rol_id', updatePersona)

// Residente CRUD
router.post('/Residente', createResidente)
router.get('/Residente/:per_id', getResidente)
router.get('/Residente', checkAuth, checkRoleAuth(['Presidente']), getAllResidente)
router.delete('/Residente/:res_id', deleteResidente)
router.put('/Residente/:per_id', updateResidente)

// Rol Residente CRUD
router.post('/rol_residente', createRolResidente)
router.get('/rol_residente/:rol_id', getRolResidenteById)
router.get('/rol_residentes', getAllRolResidentes)
router.delete('/rol_residente/:rol_id', deleteRolResidente)
router.put('/rol_residente/:rol_id', updateRolResidente)

//Usuario Externo CRUD
router.post('/usuarioExterno', createUsuarioExterno)
router.get('/usuarioExterno/:per_id', getUsuarioExterno)
router.get('/usuarioExterno', getAllUsuarioExterno)
router.delete('/usuarioExterno/:use_id', deleteUsuarioExterno)
router.put('/usuarioExterno/:per_id', updateUsuarioExterno)

//Vehiculo CRUD
router.get('/vehiculos', getAllVehiculo)
router.get('/vehiculo/:veh_placa', getVehiculoById)
router.post('/vehiculo', createVehiculo)
router.put("/vehiculo/:veh_placa", updateVehiculo)
router.delete('/vehiculo/:veh_placa', deleteVehiculo)

//Reporte CRUD
router.get('/reportes', getAllReporte)
router.get('/reporte/:rep_id', getReporteById)
router.post('/reporte', createReporte)
router.put("/reporte/:rep_id", updateReporte)
router.delete('/reporte/:rep_id', deleteReporte)

//Reporte IMG
router.get('/image', getImg)
router.get("/image/:id", getImgById)
router.post("/image", upload.single("userImage"), createImg)
router.put("/image/:id", upload.single("userImage"), updateImg)
router.delete("/image/:id", deleteImg)

//Pagos APIS
//cuotas
router.post('/cuota', createCuota)
router.get('/cuota', getAllCuota)
router.get('/alicuota', getAllAlicuota)
router.put('/alicuota/:ali_id', updateAlicuota)
router.delete('/alicuota/:ali_id', deleteAliCuota)
    // detalle pago
router.get('/detalle_pago', getAllDetallePago)
router.post('/detalle_pago', createDetallePago)
router.put('/detalle_pago/:dpag_id/:res_correo', updateEstado)
    // pagos
router.get('/pagos/:ali_id', getPagoByaliID)
router.put('/pago/:pag_id', updatePago)
router.delete('/pago/:pag_id/:ali_id', deletePago)
router.post('/pago_id/:ali_id', createPagoByID)
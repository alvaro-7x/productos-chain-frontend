
export enum TiposAcciones {

  // [AUTH]
  conectarWallet = '[Auth] Conectar wallet',
  conectarWalletSuccess = '[Auth] Conectar wallet success',
  conectarWalletError = '[Auth] Conectar wallet error',

  generarToken = '[Auth] Generar token',
  realizarLogin = '[Auth] Realizar login',
  validarToken = '[Auth] Validar token',
  noAccion = '[Auth] No realiza ninguna accion luego de que el token es valido',

  desconectarWallet = '[Auth] Desconectar wallet',
  desconectarWalletSuccess = '[Auth] Desconectar wallet success',
  desconectarWalletError = '[Auth] Desconectar wallet error',

  // [PRODUCTOS]
  listarProductos = '[Productos] Listar los productos',
  listarProductosSuccess = '[Productos] Listar los productos success',
  listarProductosError = '[Productos] Listar los productos error',

  // Seleccionar productos
  seleccionarProducto = '[Productos] Seleccionar un producto',
  deseleccionarProducto = '[Productos] Deseleccionar un producto',
  deseleccionarTodosLosProductos = '[Productos] Deseleccionar todos los productos',

  // Eliminar producto
  eliminarProducto = '[Productos] Eliminar un producto',
  eliminarProductoSuccess = '[Productos] Eliminar un producto success',
  eliminarProductoError = '[Productos] Eliminar un producto error',
  eliminarVariosProductos = '[Productos] Eliminar varios productos',
  eliminarVariosProductosSuccess = '[Productos] Eliminar varios productos success',

  // Crear producto
  crearProducto = '[Productos] Crear un producto',

  // Guardar producto
  guardarProducto = '[Productos] Guardar un producto',
  guardarProductoSuccess = '[Productos] Guardar un producto success',
  guardarProductoError = '[Productos] Guardar un producto error',

  // Editar producto
  editarProducto = '[Productos] Editar un producto',
  editarProductoSuccess = '[Productos] Editar un producto success',
  editarProductoError = '[Productos] Editar un producto error',

  // Actualizar producto
  actualizarProducto = '[Productos] Actualizar un producto',
  actualizarProductoSuccess = '[Productos] Actualizar un producto success',
  actualizarProductoError = '[Productos] Actualizar un producto error',

  iniciarBusquedaProducto = '[Productos] Iniciar busqueda de productos',
  terminarBusquedaProducto = '[Productos] Terminar busqueda de productos',
  limpiarError = '[Productos] Limpiar error producto',
  asignarError = '[Productos] Asignar error producto',

  // [DIALOGO]

  // Abrir/Cerrar dialogo
  abrirDialogo = '[Dialogo] Abrir dialogo',
  cerrarDialogo = '[Dialogo] Cerrar dialogo',

  // Procesando accion en dialogo
  procesandoAccionEnDialogo = '[Dialogo] Procesando accion en dialogo',

  // Consultar gas
  consultarGas = '[Dialogo] Consultar gas',
  consultarGasSuccess = '[Dialogo] Consultar gas success',
  consultarGasError = '[Dialogo] Consultar gas error',

  // Actualizar balance
  actualizarBalance = '[Dialogo] Actualizar balance',

  // Asignar mensaje de error
  asignarMensajeDeError = '[Dialogo] Asignar mensaje de error',

};

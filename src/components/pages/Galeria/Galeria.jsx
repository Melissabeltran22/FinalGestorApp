import { useState, useEffect, useRef } from "react"
import { consultarImagenes } from "../../../services/serviciosGaleria"

export function Galeria(){

    const [datosAPI, setDatosApi] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [terminoBusqueda, setTerminoBusqueda] = useState("field")
    const [busquedaActual, setBusquedaActual] = useState("field")
    const inputRef = useRef(null)

    // Esta función se ejecuta cuando cambia el término de búsqueda actual
    useEffect(() => {

        const timeoutId = setTimeout(() => {
            console.log("Realizando búsqueda para:", busquedaActual)

            // Indicamos que estamos cargando
            setCargando(false)
        
            // Llamamos a la API con el término de búsqueda
            consultarImagenes(busquedaActual)
            .then((datos) => {
                setDatosApi(datos)
                setCargando(true)
                console.log("Datos recibidos:", datos)

                setTimeout(() => {
                    console.log("Intentando establecer foco después de búsqueda exitosa")
                    if (inputRef.current) {
                        inputRef.current.focus()
                        console.log("Foco establecido correctamente")
                    }
                }, 100)
            })
            .catch((error) => {
                console.log("Error al consultar API:", error)
                setCargando(false)

                setTimeout(() => {
                    console.log("Intentando establecer foco después de búsqueda exitosa")
                    if (inputRef.current) {
                        inputRef.current.focus()
                        console.log("Foco establecido correctamente")
                    }
                }, 100)
            })
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [busquedaActual]) // Dependencia del useEffect

    useEffect(() => {
        // Ponemos el foco en el input al cargar la página
        console.log("Componente montado, estableciendo foco inicial")
        if (inputRef.current) {
            inputRef.current.focus()
            console.log("Foco inicial establecido")
        }
    }, [])

    useEffect(() => {
        if (cargando) {
            console.log("Datos cargados, intentando establecer foco nuevamente")
            // Aseguramos que el foco se establezca después de que los datos se han cargado y renderizado
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus()
                    console.log("Foco establecido después de cargar datos")
                }
            }, 200)
        }
    }, [cargando])

    // Función para mantener el foco en el input
    const keepFocus = () => {
        console.log("Manteniendo foco mediante evento click")
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    // Esta función se ejecuta cuando el usuario envía el formulario
    const handleBusqueda = (e) => {
        e.preventDefault() // Evita que la página se recargue
        console.log("Buscando:", terminoBusqueda)
        setBusquedaActual(terminoBusqueda) // Actualiza la búsqueda actual
    }

    // Esta función actualiza el estado mientras el usuario escribe
    const handleInputChange = (e) => {
        console.log("Cambia:", e.target.value)
        setTerminoBusqueda(e.target.value)
        setBusquedaActual(e.target.value)
    }

    const handleInputKeyUp = (e) => {
        // Si presiona Enter, realizar búsqueda inmediatamente
        if (e.key === 'Enter') {
            console.log("Enter presionado, buscando:", terminoBusqueda)
            setBusquedaActual(terminoBusqueda)
        }
    }

    if(cargando){
        return(
            <>
                <div className="container mt-4">
                    <h1>Galería de Imágenes</h1>
                    <hr />
                    
                    <div className="row mb-4">
                        <div className="col-12 col-md-6 mx-auto">
                            <form id="searchForm" onSubmit={handleBusqueda}>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        id="searchInput"
                                        className="form-control" 
                                        placeholder="¿Qué imágenes deseas buscar?" 
                                        value={terminoBusqueda}
                                        onChange={handleInputChange}
                                        onKeyUp={handleInputKeyUp}
                                        aria-label="Término de búsqueda"
                                        ref={inputRef}
                                        autoFocus                                        
                                    />
                                    <button id="searchButton" className="btn btn-primary" type="submit">
                                        <i className="bi bi-search me-1"></i>
                                        Buscar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <p className="text-center mb-4">Mostrando resultados para: <span className="fw-bold">{busquedaActual}</span></p>

                    <div className="row row-cols-1 row-cols-md-3 g-3">
                    {cargando && datosAPI && datosAPI.photos && datosAPI.photos.map((foto) => {
                        return(
                            <div className="col" key={foto.id}>
                                <div className="card h-100 shadow">
                                    <img src={foto.src.landscape} className="card-img-top" alt={foto.alt} onLoad={() => {
                                            // Intentamos establecer el foco cuando se carga cada imagen
                                            if (inputRef.current) {
                                                inputRef.current.focus()
                                            }
                                        }} />
                                    <div className="card-body">
                                        <p className="card-text">{foto.alt}</p>
                                        <p className="text-muted small">Fotografía por: {foto.photographer}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </div>
            </>
        )
    } else {
        return(
            <>
                <div className="container mt-5 text-center">
                    <h1>Galería de Imágenes</h1>
                    <hr />
                    
                    <div className="row mb-4">
                        <div className="col-12 col-md-6 mx-auto">
                            <form onSubmit={handleBusqueda}>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="¿Qué imágenes deseas buscar?" 
                                        value={terminoBusqueda}
                                        onChange={handleInputChange}
                                        aria-label="Término de búsqueda" 
                                        disabled={!cargando}
                                        ref={inputRef}
                                    />
                                    <button className="btn btn-primary" type="submit" disabled={!cargando}>
                                        <i className="bi bi-search me-1"></i>
                                        Buscar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div className="spinner-border text-primary mt-3" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando imágenes para: <span className="fw-bold">{busquedaActual}</span></p>
                </div>
            </>
        )
    }
}
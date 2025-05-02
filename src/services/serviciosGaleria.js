export async function consultarImagenes(query = "field"){

    //1. Para donde voy (URI API)
    const URL=`https://api.pexels.com/v1/search?query=${query}&per_page=10`

    //2. Configuro la peticion
    const TOKEN="LjQh3F2ALNMQckc5n0qEzslCACb3qMC7QZouHbxigZsyVVC59T89qETx"

    let peticion={
        method:"GET", 
        headers:{"Authorization":TOKEN} 
    }

    //3. Consumir el API
    
    let respuestAPI=await fetch(URL,peticion)
    let fotos=await respuestAPI.json()
    return(fotos)



}
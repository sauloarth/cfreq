const errorFormatter = error => {
    let formatedError
    if (error.response.data.data) {
        formatedError = error.response.data.data.reduce((errors, error, index) => {
            console.log(errors + error.msg)
            return `${errors}\n ${index + 1} - ${error.msg}`
        }, error.response.data.message)
    } else {
        formatedError = error.response.data.message
    }
    return formatedError
}

export default errorFormatter
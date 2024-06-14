import {AxiosError} from "axios";

export function handleError(err: AxiosError) {
  type errorData = {
    error: string
  }
  if (err.response) {
    const error = err.response.data as errorData
    // typescript is so stupid
    alert(`from ${err.request.responseURL}: ${err.response.status} ${err.response.statusText}: ${error.error}`)
  }
  console.error(err)
}


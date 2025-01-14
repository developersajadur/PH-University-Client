 import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

 const mainApi = import.meta.env.VITE_LOCAL_BASE_URL

export const baseApi = createApi({
    reducerPath: 'baseApi',
baseQuery: fetchBaseQuery({baseUrl: `${mainApi}/api/v1`,
    credentials: 'include'
}),
endpoints: () => ({})
})
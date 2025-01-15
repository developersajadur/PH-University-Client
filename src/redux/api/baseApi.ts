/* eslint-disable @typescript-eslint/no-explicit-any */
 import { BaseQueryApi, BaseQueryFn, createApi, DefinitionType, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store';
import { logout, setUser } from '../features/auth/authSlice';
 const mainApi = import.meta.env.VITE_LOCAL_BASE_URL



const baseQuery =  fetchBaseQuery({
    baseUrl: `${mainApi}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as RootState).auth.token
        if (token) {
            headers.set('authorization', `${token}`)
        }
        return headers
    }
});


const baseQueryWithRefreshToken: BaseQueryFn<
FetchArgs,
BaseQueryApi,
DefinitionType
> = async(args, api, extraOptions): Promise<any> => {
    let response = await baseQuery(args, api, extraOptions);
    if (response?.error?.status === 401) {
     //* Send Refresh
    console.log('Sending refresh token');

    const res = await fetch(`${mainApi}/auth/refresh-token`,{
        method: 'POST',
        credentials: 'include'
    })

    const data = await res.json();
    if(data.data.accessToken){
        const user = (api.getState() as RootState).auth.user;
        api.dispatch(setUser({
            user: user,
            token: data.data.accessToken
        }))
         response = await baseQuery(args, api, extraOptions);
    }else{
        api.dispatch(logout())
    }
}
    return response;
}



export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithRefreshToken,
    endpoints: () => ({})
})
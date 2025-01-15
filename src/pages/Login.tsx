import { FieldValues, useForm } from 'react-hook-form';
import { useLoginMutation } from '../redux/features/auth/authApi';
import { useAppDispatch } from '../redux/hooks';
import { setUser, TUser } from '../redux/features/auth/authSlice';
import { verifyToken } from '../utils/verifyToken';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();;
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [login, { error}] = useLoginMutation()

    const onSubmit = async (userData: FieldValues) => {
      const toastId =  toast.loading('Logging In')
      try {
        const userInfo = {
            id: userData.id,
            password: userData.password
        }
        if(error){
            console.log(error);
        }
       const res = await  login(userInfo).unwrap();

       const user = verifyToken(res?.data?.accessToken) as TUser;
       dispatch(setUser({user: user, token: res?.data?.accessToken}))
       toast.success('Logged In', {id: toastId, duration: 1000})
       navigate(`/${user.role}/dashboard`)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error('Something went wrong', {id: toastId, duration: 1000})
      }

    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* ID Field */}
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="id" style={{ display: 'block', marginBottom: '5px' }}>ID</label>
                    <input
                        type="text"
                        id="id"
                        defaultValue='A-0001'
                        {...register('id', { required: 'ID is required' })}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    {/* {errors.id && <p style={{ color: 'red', fontSize: '12px' }}>{errors.id.message}</p>} */}
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        type="password"
                        id="password"
                        defaultValue='Sojib@123'
                        {...register('password', { required: 'Password is required' })}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    {/* {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</p>} */}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;

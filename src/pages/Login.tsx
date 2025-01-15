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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ID Field */}
            <div>
                <label
                    htmlFor="id"
                    className="block text-sm font-medium text-gray-600 mb-2"
                >
                    ID
                </label>
                <input
                    type="text"
                    id="id"
                    defaultValue="A-0001"
                    {...register("id", { required: "ID is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Uncomment if error handling is needed */}
                {/* {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id.message}</p>} */}
            </div>

            {/* Password Field */}
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-600 mb-2"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    defaultValue="Sojib@123"
                    {...register("password", { required: "Password is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Uncomment if error handling is needed */}
                {/* {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>} */}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Login
            </button>
        </form>
    </div>
</div>

    );
};

export default Login;

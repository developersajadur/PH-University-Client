/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useForm, Controller, SubmitHandler, FieldValues, FieldError } from 'react-hook-form';
import { Select, Button,  DatePicker } from 'antd';
import dayjs from 'dayjs';
import { academicSemester, months } from '../../../constants/semester';
import { useCreateAcademicSemesterMutation } from '../../../redux/features/admin/academicManagement.api';
import { toast } from 'sonner';
import { TResponse } from '../../../types/global';


const CreateAcademicSemester = () => {

    const [createAcademicSemester] = useCreateAcademicSemesterMutation()


  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    // defaultValues: {
    //   name: 'Fall',
    //   year: '2025',
    //   startMonth: 'September',
    //   endMonth: 'December',
    // },
  });

  const onSubmit: SubmitHandler<FieldValues> = async(data: any) => {
    const toastId = toast.loading('Academic Semester Creating..')
    const name = academicSemester[Number(data?.name) -1]?.label
    const dataToSend = {
        name: name,
        code: data.name,
        year: data.year,
        startMonth: data.startMonth,
        endMonth: data.endMonth
    }
    // console.log('Form Data:', dataToSend);
    try {
        const res = await createAcademicSemester(dataToSend)
        if (res.error) {
            toast.error(res.error?.data.message, { id: toastId, duration: 1000 });
          } else {
            toast.success('Semester created successfully', { id: toastId, duration: 1000});
          }
        console.log(res);
    } catch (error) {
        toast.error('Something went wrong',{id: toastId, duration: 1000})
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-center text-xl md:text-2xl lg:text-3xl font-semibold mb-5">
          Create Academic Semester
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Semester Name */}
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Semester name is required' }}
            render={({ field }) => (
              <div>
                <label>Semester Name</label>
                <Select
                  {...field}
                  className="w-full"
                  options={academicSemester.map((key) => ({
                    label: key.label,
                    value: key.value,
                  }))}  
                  placeholder="Select A Semester Name"
                />
                {errors.name && <p className="text-red-500">{(errors.name as FieldError).message}</p>}
              </div>
            )}
          />

          {/* Year Picker */}
          <Controller
            name="year"
            control={control}
            rules={{ required: 'Year is required' }}
            render={({ field }) => (
              <div>
                <label>Year</label>
                <DatePicker
                  {...field}
                  picker="year"
                  className="w-full"
                  value={field.value ? dayjs(`${field.value}-01-01`, 'YYYY-MM-DD') : null}
                  onChange={(date) => {
                    if (date && date.isValid()) {
                      setValue('year', date.year().toString());
                    }
                  }}
                />
                {errors.year && <p className="text-red-500">{(errors.year as FieldError).message}</p>}
              </div>
            )}
          />

          {/* Start Month */}
          <Controller
            name="startMonth"
            control={control}
            rules={{ required: 'Start month is required' }}
            render={({ field }) => (
              <div>
                <label>Start Month</label>
                <Select
                  {...field}
                  className="w-full"
                  options={Object.keys(months).map((month) => ({
                    label: months[month as keyof typeof months],
                    value: month,
                  }))}
                  placeholder="Select A Semester Start Month"
                />
                {errors.startMonth && <p className="text-red-500">{(errors.startMonth as FieldError).message}</p>}
              </div>
            )}
          />

          {/* End Month */}
          <Controller
            name="endMonth"
            control={control}
            rules={{ required: 'End month is required' }}
            render={({ field }) => (
              <div>
                <label>End Month</label>
                <Select
                  {...field}
                  className="w-full"
                  options={Object.keys(months).map((month) => ({
                    label: months[month as keyof typeof months],
                    value: month,
                  }))}
                  placeholder="Select A Semester End Month"
                />
                {errors.endMonth && <p className="text-red-500">{(errors.endMonth as FieldError).message}</p>}
              </div>
            )}
          />

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
          >
            Create Academic Semester
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAcademicSemester;

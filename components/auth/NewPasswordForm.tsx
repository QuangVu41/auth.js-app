'use client';

import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import CardWrapper from '@/components/auth/CardWrapper';
import { NewPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FormError from '@/components/form/FormError';
import FormSuccess from '@/components/form/FormSuccess';
import { newPassword } from '@/actions/newPassword';

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      setError('');
      setSuccess('');
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper headerLabel='Enter a new password' backButtonLabel='Back to login' backButtonHref='/auth/login'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='*******' type='password' disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button className='w-full' disabled={isPending}>
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;

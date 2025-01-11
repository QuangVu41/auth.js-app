'use client';

import { BeatLoader } from 'react-spinners';
import CardWrapper from '@/components/auth/CardWrapper';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/actions/newVerification';
import FormSuccess from '../form/FormSuccess';
import FormError from '../form/FormError';

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const handleSubmit = useCallback(() => {
    if (!token) return setError('Missing token!');
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => setError('Something went wrong!'));
  }, [token]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <CardWrapper
      headerLabel='Confirming your verification'
      backButtonHref='/auth/login'
      backButtonLabel='Back to login'
    >
      <div className='flex items-center w-full justify-center'>
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;

'use client';
import { Button, ButtonProps } from '@mantine/core';
import { JSX, DetailedHTMLProps, ButtonHTMLAttributes, Ref } from 'react';
import { useRouter } from 'next/navigation';

export const ProfileShareTrip = (
  props: JSX.IntrinsicAttributes &
    ButtonProps & { component?: 'button' | undefined } & Omit<
      Omit<
        DetailedHTMLProps<
          ButtonHTMLAttributes<HTMLButtonElement>,
          HTMLButtonElement
        >,
        'ref'
      >,
      'component' | keyof ButtonProps
    > & {
      ref?: Ref<HTMLButtonElement> | undefined;
    }
) => {
  const router = useRouter();

  return (
    <Button
      variant='default'
      bd={'0px black'}
      {...props}
      onClick={() => router.push("/share-trip")}
    >
      {props.children}
    </Button>
  );
};
export default ProfileShareTrip;
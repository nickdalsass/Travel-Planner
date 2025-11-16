'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import {
  Avatar,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
} from '@mantine/core';
import { LoginButton } from "@/components/LoginButton";
import { LogoutButton } from '@/components/profile-dropdown/LogoutButton';
import { User } from '@supabase/supabase-js';
import { LogOut, NotebookPen, NotebookText } from 'lucide-react';
import ViewCreatedTripsButton from './ViewCreatedTripsButton';
import ProfileCreateTrip from './ProfileCreateTrip';

const nameToNumber = (name: string) => {
  return [...name].reduce((sum, char) => char.charCodeAt(0) + sum, 0);
};

const possibleColors = [
  '#ffb6b9',
  '#b39ddb',
  '#cb89e6',
  '#ff92c2',
  '#ffad6b',
  '#ccccff',
];

const ProfileButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      // Log the username when you're in the homepage to check it out
      console.log(user?.user_metadata?.display_name);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) {
    return <Avatar size="md" />;
  }

  if (!user) {
    return <LoginButton />;
  }

  const userName = user.user_metadata.display_name;
  const color = possibleColors[nameToNumber(userName) % possibleColors.length];

  return (
    <Menu>
      <MenuTarget>
        <Avatar
          variant='filled'
          size='45'
          color={color}
          name={userName}
          bd={'1px solid black'}
        ></Avatar>
      </MenuTarget>

      <MenuDropdown>
        <MenuLabel>Trips</MenuLabel>
        <MenuItem component={ProfileCreateTrip} leftSection={<NotebookPen />}>Create a Trip</MenuItem>
        <MenuItem component={ViewCreatedTripsButton} leftSection={<NotebookText />}>Created Trips</MenuItem>
        <MenuDivider />
        <MenuLabel>Account</MenuLabel>
        <MenuItem component={LogoutButton} leftSection={<LogOut />}>
          Logout
        </MenuItem>
      </MenuDropdown>
    </Menu>

    
  );
};

export default ProfileButton;
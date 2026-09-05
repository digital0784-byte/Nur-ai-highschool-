import React from 'react';
import { TeacherDashboardModal } from './TeacherDashboardModal';
import { UserProfile } from '../types';

interface TeacherDashboardProps {
  isOpen?: boolean;
  onClose?: () => void;
  teacherProfile: UserProfile;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  isOpen = true,
  onClose = () => {},
  teacherProfile,
}) => {
  return (
    <TeacherDashboardModal
      isOpen={isOpen}
      onClose={onClose}
      teacherProfile={teacherProfile}
    />
  );
};

export default TeacherDashboard;

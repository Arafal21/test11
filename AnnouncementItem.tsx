'use client';

import styles from './AnnouncementItem.module.scss';
import Image from 'next/image';
import { useState } from 'react';

import Avatar from '/public/icons/avatar.svg';

import { usePrincipalOrTeacher } from '../../hooks/usePrincipalOrTeacher';
import { Announcement, AnnouncementItemProps } from '../../types/announcementProps';

import { AnnouncementModal } from '../AnnouncementModal/AnnouncementModal';
import { EditButton } from '../EditButton/EditButton';
import { DeleteButton } from '../DeleteButton/DeleteButton';

import { deleteAnnouncement } from '../../api/announcementsApi';
import { ExpandButton } from '../ExpandButton/ExpandButton';
import { formatAnnouncementDate } from '../../utils/dateUtils';

export function AnnouncementItem({ announcement }: AnnouncementItemProps) {
	const [isWrapped, setIsWrapped] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentAnnouncement, setCurrentAnnouncement] = useState<typeof announcement | null>(null);

	const { isAllowed } = usePrincipalOrTeacher();

	const toggleWrapped = () => {
		setIsWrapped(!isWrapped);
	};

	const onEdit = (announcement: Announcement) => {
		setCurrentAnnouncement(announcement);
		setIsModalVisible(true);
	};

	const onDelete = async (id: string) => {
		try {
			await deleteAnnouncement(id);
		} catch (error) {
			console.error('Failed to delete announcement', error);
			alert('Failed to delete announcement');
		}
	};

	return (
		<section className={styles.announcement}>
			<div className={styles.item}>
				<div className={styles.createdInfo}>
					
					{/* <CreatedByUserBadge/> */}
					<div className={styles.user}>
						<Image src={Avatar} alt='User avatar' width={48} height={48} />
						<div className={styles.nameAndRole}>
							<p className={styles.role}>{announcement._id}</p>
							<p className={styles.name}>{announcement._id}</p>
						</div>
					</div>
					{/* <CreatedByUserBadge/> */}

					<div className={styles.actions}>
						<p className={styles.postedAt}>{formatAnnouncementDate(announcement.createdAt)}</p>
						{isAllowed && (
							<div className={styles.hiddenOnMobile}>
								<EditButton onClick={() => onEdit(announcement)} />
								<DeleteButton onClick={() => onDelete(announcement._id)} />
							</div>
						)}
					</div>
				</div>

				<div className={styles.line}></div>

				<p className={`${styles.announcementText} ${!isWrapped ? styles.announcementTextExtended : ''}`}>
					{announcement.description}
				</p>

				<ExpandButton onClick={toggleWrapped} isOpen={isWrapped} />

				{isModalVisible && (
					<AnnouncementModal
						isModalVisible={isModalVisible}
						closeModal={() => {
							setIsModalVisible(false);
							setCurrentAnnouncement(null);
						}}
						currentAnnouncement={currentAnnouncement}
					/>
				)}
			</div>
		</section>
	);
}

import React from 'react';
import {Avatar} from "@heroui/react";

const AvatarUpload = ({ value, onChange }) => {
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            onChange(imageUrl);
        }
    };

    return (
        <div>
            <Avatar
                showFallback
                isBordered
                as="button"
                type="button"
                className="transition-transform"
                color="secondary"
                size="lg"
                src={value}
                onClick={() => document.getElementById('avatarUpload').click()}
            />

            <input
                id="avatarUpload"
                type="file"
                name="avatar"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
            />
        </div>
    );
};

export default AvatarUpload;
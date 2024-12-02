import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './EditProfile.css';

const EditProfile = ({ user }) => {
    const [avatar, setAvatar] = useState(user?.profile?.picture || '');
    const [open, setOpen] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [address, setAddress] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);   
    const [username, setUsername] = useState(user?.username || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [bio, setBio] = useState(user?.profile?.bio || '');

    const SelectWithLabel = ({ label, options, value, onChange }) => {
        return (
            <FormControl fullWidth variant="outlined" >
                <InputLabel>{label}</InputLabel>
                <Select
                    value={value || ''}
                    onChange={(event) => {
                        const selected = options.find(option => option.code === event.target.value);
                        onChange(selected);
                    }}
                    label={label}
                    size="small"
                >
                    {options.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                            {option.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    };
    // Mở modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Gọi API để lấy danh sách địa chỉ
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
                setProvinces(response.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    const handleProvinceChange = (newValue) => {
        setSelectedProvince(newValue);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts(newValue ? newValue.districts || [] : []);
        setWards([]);
    };

    const handleDistrictChange = (newValue) => {
        setSelectedDistrict(newValue);
        setSelectedWard(null);
        setWards(newValue ? newValue.wards || [] : []);
    };

    const handleWardChange = (newValue) => {
        setSelectedWard(newValue);
    };

    const handleSelectAddress = () => {
        const fullAddress = `${selectedProvince?.name || ''}, ${selectedDistrict?.name || ''}, ${selectedWard?.name || ''}, ${address}`;
        
        setSelectedAddress(fullAddress);  
        setAddress(fullAddress);         
        setOpen(false);                   
    }; 

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        const updatedProfile = {
            username,
            phone,
            address: selectedAddress,
            avatar,
            bio,
        };

        try {
            const response = await axios.put('http://localhost:8000/v1/user/update-profile', updatedProfile, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('Profile updated successfully', response.data);
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    return (
        <div className="container-edit-profile">
            <div className="user-info" style={{ position: 'relative' }}>
                {avatar ? (
                    <img
                        src={avatar}
                        alt="User Avatar"
                        className="avatar"
                        style={{ width: 100, height: 100, borderRadius: '50%' }}
                    />
                ) : (
                    <AccountCircleIcon className="avatar" style={{ fontSize: 100 }} />
                )}

                <label htmlFor="avatar-upload" style={{ position: 'absolute', top: '65px', right: '200px' }}>
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                    />
                    <IconButton component="span" style={{ backgroundColor: 'white', borderRadius: '50%' }}>
                        <AddAPhotoOutlinedIcon style={{ fontSize: 25 }} />
                    </IconButton>
                </label>

                <div className="user-details">
                    <h3 className="user-name">{user?.username || 'Unknown User'}</h3>
                    <p className="user-phone">{user?.phone || 'No phone number'}</p>
                </div>
            </div>

            <Box className="name-phone">
                <TextField
                    label="Họ tên"
                    size="small"
                    fullWidth
                    required
                    defaultValue={user?.username || ''}
                    placeholder=""
                />
                <TextField label="Thêm số điện thoại" size="small" fullWidth defaultValue={user.phone} />
            </Box>
            <TextField label="Địa chỉ" size="small" fullWidth onClick={handleClickOpen} defaultValue={selectedAddress}/>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Chọn Địa chỉ</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', gap: '25px', flexDirection: "column", flexGrow: 1, width: 400, borderRadius: "15px" }}>
                        <div style={{ flex: 1 }}>
                            <SelectWithLabel
                                label="Chọn Tỉnh/Thành phố"
                                options={provinces}
                                value={selectedProvince ? selectedProvince.code : null}
                                onChange={handleProvinceChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <SelectWithLabel
                                label="Chọn Quận/Huyện"
                                options={districts}
                                value={selectedDistrict ? selectedDistrict.code : null}
                                onChange={handleDistrictChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <SelectWithLabel
                                label="Chọn Phường/Xã"
                                options={wards}
                                value={selectedWard ? selectedWard.code : null}
                                onChange={handleWardChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <TextField
                                size='small'
                                label="Địa chỉ cụ thể"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Số nhà, tên đường"
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSelectAddress} color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
            <textarea placeholder="Viết vài dòng giới thiệu bản thân" 
            className="bio-textarea"
            value={user.profile.bio} 
            onChange={(e) => setBio(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
                Cập nhật hồ sơ
            </Button>
        </div>
    );
};

export default EditProfile;
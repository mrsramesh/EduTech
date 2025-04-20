import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import CountryPicker from 'react-native-country-picker-modal';
import type { CountryCode } from 'react-native-country-picker-modal';
import Icon from 'react-native-vector-icons/Ionicons';

const EditProfile = () => {
const [photo, setPhoto] = useState<string | null>(null);
const [countryCode, setCountryCode] = useState<string>('US');

  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    nickName: '',
    email: '',
    occupation: '',
  });

  const handleImagePick = async () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || response.errorCode) return;
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets?.[0]?.uri ?? null);

      }
    });
  };

  const handleInputChange = (field:string, value:string) => {
    setForm({ ...form, [field]: value });
  };

  const handleUpdate = () => {
    console.log({
      ...form,
      dob,
      phone,
      gender,
      countryCode,
      photo,
    });
    alert('Profile Updated!');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backIcon}>
        <Icon name="arrow-back" size={22} color="#1E1E1E" />
      </TouchableOpacity>

      <Text style={styles.heading}>Edit Profile</Text>

      <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.profileImage} />
        ) : (
          <Icon name="image-outline" size={40} color="#3b7ddd" />
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={form.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
        />

        <TextInput
          placeholder="Nick Name"
          style={styles.input}
          value={form.nickName}
          onChangeText={(text) => handleInputChange('nickName', text)}
        />

        <View style={styles.inputWithIcon}>
          <Icon name="calendar-outline" size={20} color="#666" style={styles.leftIcon} />
          <TextInput
            placeholder="Date of Birth"
            style={styles.inputWithPadding}
            value={dob}
            onChangeText={(text) => setDob(text)}
          />
        </View>

        <View style={styles.inputWithIcon}>
          <Icon name="mail-outline" size={20} color="#666" style={styles.leftIcon} />
          <TextInput
            placeholder="Email"
            style={styles.inputWithPadding}
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
        </View>

        {/* <View style={styles.phoneRow}>
          <CountryPicker
            countryCode={countryCode}
            withFilter
            withFlag
            withCallingCode
            onSelect={(country) => setCountryCode(country.cca2)}
          />
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View> */}

        <View style={styles.inputWithIcon}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
          />
        </View>

        <TextInput
          placeholder="Occupation"
          style={styles.input}
          value={form.occupation}
          onChangeText={(text) => handleInputChange('occupation', text)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
        <Icon name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8faff', padding: 20 },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
    color: '#1e1e1e',
  },
  backIcon: { position: 'absolute', top: 20, left: 20, zIndex: 10 },
  imagePicker: {
    alignSelf: 'center',
    marginVertical: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  inputContainer: { gap: 12 },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputWithPadding: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  leftIcon: {
    marginLeft: 12,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: '#f8faff',
    paddingHorizontal: 6,
    fontSize: 12,
    color: '#666',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#3b7ddd',
    padding: 16,
    borderRadius: 30,
    marginVertical: 30,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

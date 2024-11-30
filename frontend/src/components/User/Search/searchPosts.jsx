import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchPosts } from '../../../redux/postAPI';
import { setPosts, setLoading, setError } from '../../../redux/postSlice';
import RoomPost from '../Post/RoomPost';
import { Swiper, SwiperSlide } from "swiper/react";
import banner1 from '../../../assets/images/banner1.jpg'
import banner2 from '../../../assets/images/banner2.jpg'
import banner3 from '../../../assets/images/banner3.jpg'
import axios from 'axios';
import 'swiper/css';
import './searchPosts.css';

const SearchPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.posts);

  const [filters, setFilters] = useState({
    keyword: '',
    province: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
  });

  const [provinces, setProvinces] = useState([]);

  // Fetch provinces on component mount
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'minPrice' || name === 'maxPrice') {
      console.log(`${name}:`, value);
    }  
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleCategoryChange = (category) => {
    setFilters({
      ...filters,
      category: category,  // Update category in the filters
    });
  };

  const handleProvinceChange = (provinceName) => {
    setFilters({
      ...filters,
      province: provinceName,  // Update province in the filters
    });
  };
  
  // Hàm chuyển đổi giá trị input
  const convertValue = (value) => {
    if (!value) return ''; // Nếu không có giá trị, trả về chuỗi rỗng
    const converted = parseFloat(value.replace(/[^\d.-]/g, '')); // Loại bỏ ký tự không phải số
    return isNaN(converted) ? '' : converted; // Trả về số hoặc chuỗi rỗng nếu không chuyển đổi được
  };

  const handleSearch = async () => {
    dispatch(setLoading(true));
    try {
      const token = localStorage.getItem('token');

      // Chuẩn hóa dữ liệu trước khi gửi API
      const preparedFilters = {
        ...filters,
        minPrice: convertValue(filters.minPrice),
        maxPrice: convertValue(filters.maxPrice),
        minArea: convertValue(filters.minArea),
        maxArea: convertValue(filters.maxArea),
      };

      console.log("Prepared Filters:", preparedFilters);

      const results = await searchPosts(preparedFilters, token);
      dispatch(setPosts(results));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };
  
  return (
    <div className="search-posts">
  <div className='picture'>
    <div className="overlay">
      <h2>Tìm phòng trọ dễ dàng, sống gần nơi bạn yêu</h2>
      <p>
        Khám phá không gian sống lý tưởng, phù hợp với mọi nhu cầu
      </p>
    </div>
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      navigation={true}
      className="mySwiper"
    >
      <SwiperSlide>
        <img src={banner1} alt="Room 1" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={banner2} alt="Room 2" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={banner3} alt="Room 3" />
      </SwiperSlide>
    </Swiper>
  </div>

    <div className="filters">
      {/* Keyword Input */}
      <div className="input-group-keyword">
        <div className="add_input_field_search_keyword" data-inputfield="0" data-title-tour="Nhập từ khóa">
          <div className="field-group-content">
            <div className="icon"><i className="fas fa-search"></i></div>
            <div className="field-content">
              {/* <div className="title-field-DM  ">Từ khóa</div> */}
              <input
                type="text"
                name="keyword"
                placeholder="Từ khóa, loại hình cho thuê, địa danh, dự án,..."
                value={filters.keyword}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

  {/* <div className="search-bar">
        <div className="filters"> */}
      <div className="search-bar">
  <div className="filters">
   
          {/* Location Dropdown */}
          <div className="input-group">
            <div className="add_input_field is-active" data-inputfield="1" data-title-tour="Chọn địa điểm">
              <div className="field-group-content">
                <div className="icon"><i className="flaticon-location"></i></div>
                <div className="field-content">
                  <div className="title-field-DM">Địa điểm</div>
                  <div className="add_ids_title">
                    <div className="add_ids_title_value">{filters.province || "Chọn địa điểm"}</div>
                    <i className="fas fa-chevron-down"></i>
                    <ul className="add_ids_list">
                      {provinces.map((province) => (
                        <li
                          className="term_item"
                          key={province.code}
                          onClick={() => handleProvinceChange(province.name)}
                        >
                          {province.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
    {/* Category Dropdown */}
<div className="input-group">
  <div className="add_input_field is-active" data-inputfield="1" data-title-tour="Chọn danh mục">
    <div className="field-group-content">
      <div className="icon"><i className="flaticon-recovery"></i></div>
      <div className="field-content">
        <div className="title-field-DM">Danh mục</div>
        <div className="add_ids_title">
          {/* Display the selected category or default text */}
          <div className="add_ids_title_value">{filters.category || "Chọn danh mục"}</div>
          <i className="fas fa-chevron-down"></i>
          <ul className="add_ids_list">
            {/* Clickable list items for categories */}
            <li 
              className="term_item" 
              data-id="0"
              onClick={() => handleCategoryChange('')}
            >
              Chọn danh mục
            </li>
            <li 
              className="term_item" 
              data-id="1"
              onClick={() => handleCategoryChange('Nhà trọ, phòng trọ')}
            >
              Nhà trọ, phòng trọ
            </li>
            <li 
              className="term_item" 
              data-id="2"
              onClick={() => handleCategoryChange('Nhà nguyên căn')}
            >
              Nhà nguyên căn
            </li>
            <li 
              className="term_item" 
              data-id="3"
              onClick={() => handleCategoryChange('Cho thuê căn hộ')}
            >
              Cho thuê căn hộ
            </li>
            <li 
              className="term_item" 
              data-id="4"
              onClick={() => handleCategoryChange('Cho thuê căn hộ mini')}
            >
              Cho thuê căn hộ mini
            </li>
            <li 
              className="term_item" 
              data-id="5"
              onClick={() => handleCategoryChange('Cho thuê căn hộ dịch vụ')}
            >
              Cho thuê căn hộ dịch vụ
            </li>
            <li 
              className="term_item" 
              data-id="6"
              onClick={() => handleCategoryChange('Cho thuê mặt bằng, văn phòng')}
            >
              Cho thuê mặt bằng, văn phòng
            </li>
            {/* Add more categories here */}
          </ul>
          <input type="hidden" name="add_ids_ba_category" value={filters.category} />
        </div>
      </div>
    </div>
  </div>
</div>

    {/* Price Range Slider */}
    <div className="input-group">
      <div className="add_input_field is-active" data-inputfield="1" data-title-tour="Chọn giá">
        <div className="field-group-content">
          <div className="icon"><i className="fas fa-money-bill-wave"></i></div>
          <div className="field-content">
            <div className="title-field">Giá</div>
            <div className="price-range">
              <input
                type="number"
                name="minPrice"
                placeholder="Giá tối thiểu"
                value={filters.minPrice}
                onChange={handleInputChange}
              />
              <span>-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Giá tối đa"
                value={filters.maxPrice}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

{/* Area Range */}
<div className="input-group">
  <div className="add_input_field is-active" data-inputfield="1" data-title-tour="Chọn diện tích">
    <div className="field-group-content">
      <div className="icon"><i className="fas fa-expand-arrows-alt"></i></div>
      <div className="field-content">
        <div className="title-field">Diện tích</div>
        <div className="area-range">
          <div className="range-slider-container">
            {/* Thanh trượt diện tích tối thiểu */}
            <input
              type="range"
              name="minArea"
              min="0"
              max="500"
              step="1"
              value={filters.minArea}
              onChange={handleInputChange}
              className="min-range"
            />
            {/* Thanh trượt diện tích tối đa */}
            <input
              type="range"
              name="maxArea"
              min="0"
              max="500"
              step="1"
              value={filters.maxArea}
              onChange={handleInputChange}
              className="max-range"
            />
            <div className="range-values">
              <span>Diện tích tối thiểu: {filters.minArea} m²</span>
              <span>Diện tích tối đa: {filters.maxArea} m²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    {/* Search Button */}
    <div className="button-search">
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
      </button>
    </div>
  </div>
</div>

  {/* Error message */}
  {error && <p className="error">{error}</p>}

  <div className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <RoomPost
              key={post.id}
              post={post}
              onTitleClick={() => handlePostClick(post.id)}
            />
          ))
        ) : (
          <p>Không tìm thấy bài đăng nào.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default SearchPosts;
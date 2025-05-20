import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Footer } from "../components/Footer"; // Import the Footer component
const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCart,  } from "../context/cartContext";
import { WideItemFb, CartItem} from '@/constants/types';




export default function ProductDetailScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [widelisting, setWidelisting] = useState<WideItemFb[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);

  const { addToCart, incrementItem, decrementItem } = useCart();

  

 useEffect(() => {
  const fetchWidelisting = async () => {
    try {
      const q = query(collection(db, "widelisting"), where("name", "==", name));
      const snapshot = await getDocs(q);
      const wideList = snapshot.docs.map(doc => doc.data() as WideItemFb);
      setWidelisting(wideList);

      if (wideList.length > 0) {
        const item = wideList[0];

        if (item.variants?.length > 0 && !selectedSize) {
          setSelectedSize(item.variants[0].size);
        }

        const colors = (item as any).colorOptions;
        if (Array.isArray(colors) && colors.length > 0) {
          setSelectedColor(colors[0].color);
        }
        if (!widelisting[0] || !selectedSize) return;
        const index = widelisting[0].variants.findIndex(v => v.size === selectedSize);
        setSelectedVariantIndex(index);
      }
    } catch (error) {
      console.error("Error fetching widelisting:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchWidelisting();
}, [selectedSize]);



  const productData = {
    id: "12345",
    name: "Fresh Red Apple",
    brand: "Organic Farms",
    description: "Product Description",
    rating: 4.0,
    reviewCount: 120,
    price: 295,
    mrp: 350,
    discountPercentage: 15.7,
    inStock: true,
    images: [
      require('../assets/loading.png'),
      require('../assets/loading.png'),
      require('../assets/loading.png'),
    ],
    deliveryLocation: {
      area: "Tarnaka",
      city: "Hyderabad",
      pincode: "500019"
    },
    helpText: "Not sure what fits your needs? Click here to explore the category and decide",
    sizeOptions: [
      { size: "50 Kg", price: 295 },
      { size: "100 Kg", price: 570 },
      { size: "150 Kg", price: 850 }
    ],
    colorOptions: [
      { color: "Red", name: "Red" },
      { color: "Green", name: "Green" },
      { color: "Yellow", name: "Yellow" },
    ],
    bulkPricing: [
      { range: ">1000", price: 295 },
      { range: "500-1000", price: 305 },
      { range: "100-500", price: 315 },
      { range: "0-100", price: 330 }
    ],
    defaultQuantity: 1
  };

  // const [quantity, setQuantity] = useState(productData.defaultQuantity);
  const [selectedWeight, setSelectedWeight] = useState(productData.sizeOptions[0].size);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [cartCount, setCartCount] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(productData.colorOptions[0].color);
  const [showingOptions, setShowingOptions] = useState<'size' | 'color'>('size');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);


  const increaseQuantity = () => {
    setCartCount(prev => prev + 1);
    // incrementItem(widelisting[0].name);
  };
  
  const decreaseQuantity = () => {
    setCartCount(prev => (prev > 1 ? prev - 1 : 1));
    // decrementItem(widelisting[0].name);
  }
  const toggleWishlist = () => setIsInWishlist(prev => !prev);

  

  // Calculate selectedVariantIndex dynamically based on selected size and color
  // const selectedVariantIndex = (() => {
  //   if (!widelisting[0] || !selectedSize) return -1;
  //   return widelisting[0].variants.findIndex(v => v.size === selectedSize);
  // })();

  const getCurrentPrice = () => {
    if (!widelisting[0] || !selectedSize) return 0;
    const variant = widelisting[0].variants.find(v => v.size === selectedSize);
    if (!variant || !variant.priceTiers || variant.priceTiers.length === 0) return 0;
    // For simplicity, return the lowest price tier
    const slab = variant.priceTiers.find((s) => cartCount >= s.min && cartCount <= s.max);
    return slab ? slab.price : 0;
    // return variant.priceTiers[0].price;
  };

  const handleAddToCart = () => {
    if (!widelisting[0] || selectedVariantIndex === -1) {
      alert("Please select a size.");
      return;
    }

    const item: CartItem = {
      product: widelisting[0],
      variantIndex: selectedVariantIndex,
      quantity: cartCount,
      price: getCurrentPrice(),
    };

    addToCart(item);
    alert("Added to cart!");
  };


  const onMomentumScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const page = Math.floor(offsetX / SCREEN_WIDTH);
    setCurrentImageIndex(page);
  };

  const toggleOptionsView = (option: 'size' | 'color') => setShowingOptions(option);
  const handleColorSelect = (color: string) => setSelectedColor(color);

 return (
  <View style={styles.container}>
    
    <View style={styles.header}>
      {/* Uncomment if needed */}
      {/* <View style={styles.headerTop}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Detail</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Feather name="shopping-cart" size={24} color="#333" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View> */}
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>Delivery to</Text>
        <Text>
          {`${productData.deliveryLocation.area}, ${productData.deliveryLocation.city}, ${productData.deliveryLocation.pincode}`}
        </Text>
      </View>
    </View>

    <ScrollView style={styles.scrollView}>
      {/* IMAGE CAROUSEL */}
      <View style={styles.imageCarousel}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          style={styles.carouselScroll}
        >
          {widelisting.length > 0 && widelisting[0].image && (
            <View
              style={{
                width: SCREEN_WIDTH,
                height: 250,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: widelisting[0].image }}
                style={styles.carouselImage}
                resizeMode="contain"
              />
            </View>
          )}
        </ScrollView>

        <View style={styles.imageActions}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleWishlist}>
            <AntDesign
              name={isInWishlist ? "heart" : "hearto"}
              size={24}
              color="#e63946"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="share-2" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.carouselIndicators}>
          {productData.images.map((_, i) => (
            <View
              key={i}
              style={i === currentImageIndex ? styles.activeIndicator : styles.inactiveIndicator}
            />
          ))}
        </View>
      </View>

      {/* PRODUCT DETAILS */}
      <View style={styles.productDetails}>
        <View style={styles.brandRatingContainer}>
          <Text style={styles.brandText}>
            {widelisting.length > 0 ? widelisting[0].subcategoryName : ""}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingNumber}>{productData.rating.toFixed(1)}</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star, index) => (
                <AntDesign
                  key={index}
                  name={index < Math.round(productData.rating) ? "star" : "staro"}
                  size={16}
                  color="#fbbf24"
                />
              ))}
            </View>
            <Text style={styles.reviewCount}>({productData.reviewCount})</Text>
          </View>
        </View>
      </View>

      <Text style={styles.helpText}>{productData.helpText}</Text>

      {/* Option selectors */}
      <View style={styles.optionSelectorContainer}>
        <TouchableOpacity
          style={[
            styles.optionSelectorTab,
            showingOptions === "size" && styles.activeOptionSelectorTab,
          ]}
          onPress={() => toggleOptionsView("size")}
        >
          <Text style={styles.optionSelectorText}>Size</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionSelectorTab,
            showingOptions === "color" && styles.activeOptionSelectorTab,
          ]}
          onPress={() => toggleOptionsView("color")}
        >
          <Text style={styles.optionSelectorText}>Colour</Text>
        </TouchableOpacity>
      </View>

      {/* Option Buttons */}
      {showingOptions === "size" && widelisting.length > 0 ? (
        <View style={styles.sizeOptionsContainer}>
          {widelisting[0]?.variants?.map((option) => (
            <TouchableOpacity
              key={option.size}
              style={[
                styles.sizeOption,
                selectedSize === option.size && styles.selectedSizeOption,
              ]}
              onPress={() => {
                setSelectedSize(option.size);
                // Optional: reset selectedColor or other states if needed
              }}
            >
              <Text style={styles.sizeText}>{option.size}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Price/pc as per quantity</Text>
      <View style={styles.bulkPricingContainer}>
        {widelisting.length > 0 &&
          widelisting[0].variants
            .find((variant) => variant.size === selectedSize)
            ?.priceTiers.map((pricing, index) => (
              <View key={index} style={styles.bulkPriceOption}>
                <Text style={styles.bulkPriceRange}>
                  {pricing.min} - {pricing.max ?? "∞"}
                </Text>
                <Text style={styles.bulkPriceValue}>₹{pricing.price}</Text>
              </View>
            ))}
      </View>

      <View style={styles.addToCartContainer}>
        <Text style={styles.quantityTitle}>Enter Quantity</Text>
        <View style={styles.quantityCartRow}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
              <AntDesign name="minus" size={16} color="#333" />
            </TouchableOpacity>
            <View style={styles.quantityValueContainer}>
              <Text style={styles.quantityLabel}>Default</Text>
              <Text style={styles.quantityValue}>{cartCount}</Text>
            </View>
            <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
              <AntDesign name="plus" size={16} color="#333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to cart</Text>
            <Feather name="shopping-cart" size={20} color="#fff" style={styles.cartIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    <Footer />
    
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#333',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'column',
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ec',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  imageCarousel: {
    position: 'relative',
    backgroundColor: '#eee',
    height: 280,
  },
  carouselScroll: {
    width: '100%',
    height: '100%',
  },
  carouselImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: 250,
  },
  imageActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  carouselIndicators: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 24,
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    marginHorizontal: 2,
  },
  inactiveIndicator: {
    width: 4,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginHorizontal: 2,
  },
  productDetails: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
    padding: 16,
  },
  brandRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandText: {
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  starContainer: {
    flexDirection: 'row',
  },
  reviewCount: {
    color: '#3b82f6',
    marginLeft: 8,
  },
  productDescription: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
  priceContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mrpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrpLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  mrpValue: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  discountPercentage: {
    fontSize: 12,
    color: '#ef4444',
    marginLeft: 8,
  },
  helpText: {
    color: '#666',
    fontSize: 10,
    marginBottom: 16,
    paddingLeft:15,
  },
  sectionTitle: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 8,
    paddingLeft:18,
  },
  optionSelectorContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft:15,
  },
  optionSelectorTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  activeOptionSelectorTab: {
    backgroundColor: '#d1d5db',
  },
  optionSelectorText: {
    fontWeight: '500',
  },
  sizeOptionsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft:15,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  colorOption: {
    backgroundColor: '#d1d5db',
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginRight: 10,
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#333',
  },
  colorText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3
  },
  sizeOption: {
    backgroundColor: '#d1d5db',
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginRight: 10,
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    
  },
  selectedSizeOption: {
    backgroundColor: '#fbbf24',
    
  },
  sizeText: {
    fontSize: 14,
  },
  sizePrice: {
    fontWeight: 'bold',
    fontSize: 16,
    
  },
  bulkPricingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
    paddingLeft:15,
  },
  bulkPriceOption: {
    backgroundColor: '#d1d5db',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  bulkPriceRange: {
    fontSize: 14,
  },
  bulkPriceValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  addToCartContainer: {
    backgroundColor: '#0C8744',
    borderRadius: 12,
    padding: 12,
    margin: 16,
  },
  quantityTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quantityCartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantitySelector: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  quantityButton: {
    width: 18,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValueContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  quantityLabel: {
    fontSize: 10,
    color: '#666',
  },
  quantityValue: {
    fontSize: 12,
  },
  addToCartButton: {
    backgroundColor: '#27C264',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  cartIcon: {
    marginLeft: 8,
  },
});
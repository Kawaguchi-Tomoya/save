export const MAP_BOUNDS = {
    minLat: 33.6020,
    maxLat: 33.6120,
    minLng: 133.6770,
    maxLng: 133.6870,
  };
  
  // 小数点第4位で切り捨てる補助関数
  export const truncateCoord = (num: number): number => {
    return Math.floor(num * 10000) / 10000;
  };
  
  /**
   * 緯度経度を画面上のパーセント位置(x, y)に変換する
   */
  export const getPinPosition = (lat: number, lng: number) => {
    const { minLat, maxLat, minLng, maxLng } = MAP_BOUNDS;
  
    // 4桁に丸めてから計算
    const tLat = truncateCoord(lat);
    const tLng = truncateCoord(lng);
  
    const x = ((tLng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - tLat) / (maxLat - minLat)) * 100;
  
    return { x: `${x}%`, y: `${y}%` };
  };
  
  /**
   * クリックした画面座標から緯度経度を逆算する
   */
  export const calculateLocation = (
    clientX: number,
    clientY: number,
    rect: DOMRect
  ): { lat: number; lng: number } => {
    const xPercent = (clientX - rect.left) / rect.width;
    const yPercent = (clientY - rect.top) / rect.height;
  
    const rawLng = xPercent * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng) + MAP_BOUNDS.minLng;
    const rawLat = MAP_BOUNDS.maxLat - (yPercent * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat));
  
    return {
      lat: truncateCoord(rawLat),
      lng: truncateCoord(rawLng),
    };
  };
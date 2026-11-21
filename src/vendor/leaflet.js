// Leaflet servido a partir do próprio site (sem CDN de terceiros — ver política de privacidade).
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// O Vite renomeia as imagens com hash, o que quebra a deteção automática do caminho dos ícones.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// Scripts inline (ex.: saude.html) usam o global L.
window.L = L;

export default L;

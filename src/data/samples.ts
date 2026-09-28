import healthyImg from '@/src/assets/images/sample_tomato_healthy_1790584381005.jpg';
import earlyBlightImg from '@/src/assets/images/sample_early_blight_1790584389405.jpg';
import septoriaImg from '@/src/assets/images/sample_septoria_spot_1790584405477.jpg';

export interface SampleLeaf {
  id: string;
  name: string;
  pathology: string;
  imageSrc: string;
  description: string;
  expectedStatus: 'Healthy' | 'Diseased';
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-healthy',
    name: 'Healthy Foliage',
    pathology: 'Normal leaf lamina',
    imageSrc: healthyImg,
    description: 'Vibrant green chlorophyll pigmentation without lesions, spots, or yellowing.',
    expectedStatus: 'Healthy',
  },
  {
    id: 'sample-early-blight',
    name: 'Early Blight',
    pathology: 'Alternaria solani',
    imageSrc: earlyBlightImg,
    description: 'Concentric target-like rings with chlorotic yellow surrounding halos.',
    expectedStatus: 'Diseased',
  },
  {
    id: 'sample-septoria',
    name: 'Septoria Leaf Spot',
    pathology: 'Septoria lycopersici',
    imageSrc: septoriaImg,
    description: 'Numerous small circular lesions with light grey centers and dark margins.',
    expectedStatus: 'Diseased',
  },
];

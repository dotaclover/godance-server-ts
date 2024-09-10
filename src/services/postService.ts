import MongoCrud from '../library/MongoCrud';
import { PostMongo } from '../models/PostMongo';

const postService = new MongoCrud(PostMongo);
export default postService;
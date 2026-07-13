// @file: Lists universities and programs the student saved as favorites.
import { redirect } from 'next/navigation';



/** Yêu thích nằm trong hồ sơ — giữ URL cũ để bookmark/deeplink. */

export default function FavoritesRedirectPage() {

    redirect('/profile#favorites');

}


import logo from '../../public/sacred-logos-wordmark.svg'
import logoLight from '../../public/sacred-logos-wordmark-light.svg'
import mobileLogo from '../../public/logo.svg'
import React from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import { motion } from 'framer-motion'

export const Logo = ({ invertTheme = false, className }) => {
  const { resolvedTheme } = useTheme()
  return (
    <Image
      src={resolvedTheme === 'dark' || invertTheme ? logoLight : logo}
      width={200}
      alt={logo}
      className={className}
    />
  )
}

export const MobileLogo = (props: any) => {
  return <Image unoptimized src={mobileLogo} className={'w-8'} alt={logo} {...props} />
}

const purpleAnimation = {
  initial: { fill: 'transparent', opacity: 0 },
  animate: { fill: '#721BEF', opacity: 1 },
  transition: { duration: 1.5, delay: 0.9 },
  exit: { fill: 'transparent', opacity: 0 },
}

const logoAnimation = {
  initial: { fill: '#721BEF', opacity: 0.9, pathLength: 0 },
  animate: { opacity: [0.5, 1], pathLength: 1 },
  transition: { duration: 2, delay: 0 },
}
const duration = 0.5
export const DynamicLogo = ({ purple = '#721BEF', black = '#000', className }) => {
  const { resolvedTheme } = useTheme()

  if (resolvedTheme === 'dark') {
    black = '#fff'
  }

  return (
    <motion.svg
      height="220"
      viewBox="0 0 2993 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_2713_1307)">
        <motion.path
          {...purpleAnimation}
          d="M1820.67 406.257L1883.31 401V67.1735H1820.67V406.257ZM2026.22 406.257C2082.73 406.257 2133.55 362.448 2133.55 297.172C2133.55 231.458 2082.73 187.649 2026.22 187.649C1970.14 187.649 1919.33 231.458 1919.33 297.172C1919.33 362.448 1970.14 406.257 2026.22 406.257ZM1982.85 297.172C1982.85 268.696 2002.13 248.544 2026.22 248.544C2050.32 248.544 2070.03 268.696 2070.03 297.172C2070.03 325.648 2050.32 345.362 2026.22 345.362C2002.13 345.362 1982.85 325.648 1982.85 297.172ZM2379.32 376.029V192.906H2317.11V215.687C2302.21 196.411 2275.93 187.649 2255.77 187.649C2206.71 187.649 2160.27 229.706 2160.27 296.734C2160.27 364.2 2206.71 406.257 2255.77 406.257C2275.93 406.257 2302.21 397.495 2317.11 377.781V383.914C2317.11 431.666 2296.52 450.943 2263.66 450.943C2243.07 450.943 2224.23 436.924 2216.78 420.276L2165.53 441.743C2180.86 481.171 2218.97 508.771 2263.66 508.771C2335.07 508.771 2379.32 464.085 2379.32 376.029ZM2223.79 296.734C2223.79 270.448 2244.82 248.544 2269.36 248.544C2293.01 248.544 2314.48 270.01 2314.48 296.734C2314.48 323.458 2293.45 345.362 2269.36 345.362C2244.82 345.362 2223.79 323.02 2223.79 296.734ZM2522.63 406.257C2579.15 406.257 2629.97 362.448 2629.97 297.172C2629.97 231.458 2579.15 187.649 2522.63 187.649C2466.56 187.649 2415.74 231.458 2415.74 297.172C2415.74 362.448 2466.56 406.257 2522.63 406.257ZM2479.26 297.172C2479.26 268.696 2498.54 248.544 2522.63 248.544C2546.73 248.544 2566.44 268.696 2566.44 297.172C2566.44 325.648 2546.73 345.362 2522.63 345.362C2498.54 345.362 2479.26 325.648 2479.26 297.172ZM2743.86 406.257C2783.73 406.257 2828.85 384.352 2828.85 338.791C2828.85 324.334 2824.47 291.039 2774.97 277.02L2740.8 267.382C2730.72 264.753 2724.15 260.372 2724.15 252.487C2724.15 243.287 2732.91 238.03 2743.43 238.03C2755.69 238.03 2764.45 244.601 2764.45 258.182H2823.6C2824.47 206.049 2779.35 187.649 2742.11 187.649C2694.36 187.649 2661.5 219.192 2661.5 249.858C2661.5 267.382 2662.82 302.867 2721.08 318.639L2746.93 325.648C2761.39 329.591 2766.21 332.219 2766.21 339.229C2766.21 348.867 2755.25 355.876 2742.11 355.876C2724.15 355.876 2717.14 344.048 2717.14 333.534H2658C2658 380.848 2700.05 406.257 2743.86 406.257Z"
        />
        <motion.path
          d="M342.973 238.959C307.529 201.194 250.871 190.929 204.468 213.597H204.369C223.51 193.812 236.512 171.212 243.062 146.208C258.894 85.7216 242.583 47.0615 228.937 23.2403C219.602 6.94475 213.826 2.59018 213.583 2.4081C212.748 1.79361 211.625 1.89223 210.889 2.575L210.881 2.56742L124.578 83.4988L50.4338 153.035C27.3458 174.687 14.0713 204.023 13.0619 235.651C12.0524 267.279 23.4219 297.404 45.083 320.482C68.2925 345.206 99.5622 357.852 131.174 357.852C149.176 357.852 167.278 353.733 184.067 345.426C164.713 365.302 151.575 388.054 144.987 413.225C127.105 481.54 151.203 522.689 159.127 536.208C166.967 549.598 172.712 555.401 174.283 556.865C174.693 557.245 175.209 557.427 175.725 557.427C176.249 557.427 176.758 557.23 177.167 556.85L177.175 556.858L337.63 406.405C385.286 361.714 387.684 286.601 342.973 238.959ZM175.778 552.382C175.649 552.245 175.52 552.109 175.384 551.957L175.725 551.76C175.824 551.934 175.877 552.101 175.908 552.253L175.778 552.382ZM264.04 261.832C261.626 249.367 252.283 239.839 236.261 233.527C232.967 232.23 230.288 231.221 227.958 230.401C227.237 229.703 226.357 229.089 225.34 228.535C232.132 229.954 239.927 233.034 249.642 238.079C264.427 245.756 272.927 256.066 274.916 268.72C278.202 289.643 263.949 316.863 233.688 347.451C227.935 353.27 222.106 359.407 216.376 365.697C199.975 383.691 187.171 403.264 178.329 423.884C161.267 464.039 156.03 495.234 157.009 516.43C152.243 497.017 150.262 465.086 165.654 419.924C172.773 399.175 184.264 379.769 199.815 362.237C205.098 356.282 210.828 350.372 216.839 344.69C251.813 311.628 268.131 282.975 264.04 261.832ZM171.908 542.998C174.04 531.497 192.362 497.828 231.859 442.357C248.367 419.385 266.37 399.835 278.566 387.477C284.562 381.4 290.346 374.906 296.251 367.623C315.195 344.25 325.539 319.845 326.162 297.025C326.807 273.295 316.849 252.424 297.359 236.66C281.101 223.513 263.691 215.676 246.477 213.377C268.578 214.371 290.839 223.634 309.753 240.575C346.517 273.499 347.679 324.616 312.728 370.795C307.248 378.032 301.381 384.753 295.287 390.769C282.635 403.257 263.66 422.845 245.134 445.247C194.168 507.281 177.183 532.346 171.908 542.998ZM279.105 268.06C276.897 254.002 267.645 242.653 251.6 234.323C241.035 228.838 232.808 225.629 225.446 224.218C237.218 224.863 250.143 229.643 264.639 238.693C279.682 248.085 288.289 260.178 290.224 274.653C293.199 296.911 280.487 324.1 253.452 353.285L250.059 356.957C245.794 361.57 241.119 366.622 236.117 371.97C219.222 390.011 205.401 409.273 195.034 429.217C175.422 467.339 163.62 501.97 161.98 524.199C159.013 503.162 163.938 468.621 182.237 425.538C190.89 405.366 203.436 386.187 219.518 368.541C225.211 362.29 230.994 356.191 236.709 350.418C267.948 318.843 282.604 290.364 279.105 268.06ZM226.311 235.719C226.926 238.799 224.763 245.111 210.965 257.682C202.76 265.147 195.011 270.563 186.571 274.721C153.487 290.978 111.592 281.321 84.6939 251.241C78.1136 243.897 72.6945 235.598 68.5809 226.57C56.5511 200.17 60.7331 168.117 79.0699 143.697C66.4709 166.334 64.9909 192.651 75.6242 214.713C79.6088 222.989 84.6712 230.644 90.6519 237.449C108.867 258.228 133.959 269.737 158.337 269.737C167.172 269.737 175.915 268.227 184.203 265.094C191.96 262.15 199.238 258.107 207.777 252C219.215 243.814 224.611 238.981 226.159 235.219C226.22 235.378 226.273 235.545 226.311 235.719ZM230.387 238.943C231.89 245.407 227.116 255.239 216.664 266.793C208.642 275.662 200.081 282.694 190.495 288.293C154.011 309.573 105.68 300.97 75.5634 267.825C68.1331 259.662 62.1372 250.384 57.7275 240.248C44.9464 210.866 49.728 176.364 69.6511 150.266C55.6556 174.452 53.5228 203.697 64.7329 228.315C69.0211 237.737 74.6755 246.393 81.5442 254.056C100.526 275.282 126.68 286.768 152.364 286.768C164.789 286.768 177.099 284.082 188.438 278.506C197.242 274.167 205.31 268.538 213.811 260.8C223.852 251.666 229.233 244.588 230.387 238.943ZM219.245 227.678L219.192 227.822L219.101 227.67C219.154 227.67 219.199 227.678 219.245 227.678ZM222.152 232.343C222.319 232.518 222.417 232.677 222.433 232.799C222.729 234.915 216.968 240.21 205.318 248.548C197.083 254.435 190.108 258.319 182.708 261.126C153.214 272.278 117.497 261.634 93.832 234.65C88.1017 228.125 83.2595 220.797 79.4342 212.869C67.9358 189.018 71.4878 159.84 88.6634 136.588C77.385 158.005 76.4666 181.636 86.523 201.103C90.2041 208.226 94.6517 214.864 99.7596 220.82C117.413 241.485 141.83 253.342 165.092 253.342C170.101 253.342 175.065 252.789 179.892 251.658C186.822 250.02 193.546 247.402 201.69 243.177C206.335 240.764 210.107 238.906 213.135 237.419C218.19 234.938 220.884 233.603 222.152 232.343ZM217.143 230.659C215.678 231.456 213.568 232.495 211.268 233.625C208.217 235.128 204.422 236.994 199.732 239.429C191.914 243.495 185.493 245.999 178.921 247.554C153.222 253.585 123.417 242.016 102.978 218.081C98.0822 212.368 93.8168 206.011 90.2876 199.176C79.8592 178.981 82.0603 153.893 96.1772 132.074L96.3897 131.649C96.9362 130.163 98.1202 128.114 99.6989 125.747C99.6533 125.869 99.5926 126.005 99.5471 126.127C88.3446 147.672 87.5704 170.044 97.4371 187.538C100.792 193.494 104.64 199.107 108.86 204.213C126.605 225.72 150.247 238.299 172.636 238.299C173.577 238.299 174.519 238.276 175.46 238.23C181.843 237.919 188.408 236.652 195.519 234.361C208.9 230.037 215.503 230.454 217.143 230.659ZM53.8492 241.933C58.441 252.493 64.6873 262.158 72.4289 270.67C92.2761 292.518 119.728 304.141 146.884 304.141C162.754 304.141 178.534 300.165 192.62 291.949C202.585 286.123 211.473 278.825 219.791 269.638C229.005 259.449 234.06 250.414 234.796 243.139C236.443 251.476 232.117 263.243 222.387 275.897C214.592 286.032 205.189 294.772 194.442 301.865C154.064 328.493 100.23 321.149 66.4254 284.416C58.145 275.426 51.5647 265.17 46.859 253.927C33.3493 221.639 38.6697 184.671 60.0955 156.829C44.5821 182.736 41.8953 214.462 53.8492 241.933ZM198.783 431.159C208.976 411.564 222.569 392.621 239.198 374.861C244.208 369.505 248.891 364.445 253.164 359.832L256.556 356.168C284.471 326.027 297.564 297.647 294.414 274.099C292.304 258.319 283.044 245.202 266.878 235.112C254.226 227.215 242.644 222.436 231.882 220.683C247.19 221.358 263.379 227.617 279.659 239.323C295.059 250.399 303.848 264.35 305.776 280.797C308.531 304.285 297.268 331.376 273.208 359.127C267.053 366.228 261.376 372.479 255.835 378.244C243.881 390.678 226.524 410.532 211.724 434.558C191.656 467.468 170.716 507.691 166.033 530.89C165.464 512.705 174.648 478.081 198.783 431.159ZM169.297 537.437C170.337 522.469 183.998 488.133 215.329 436.758C229.931 413.058 247.077 393.447 258.886 381.165C264.48 375.346 270.203 369.042 276.403 361.888C301.26 333.212 312.865 304.998 309.973 280.297C307.901 262.621 298.535 247.675 282.126 235.879C267.106 225.076 252.101 218.741 237.673 216.928C256.761 217.398 276.464 225.189 294.702 239.937C313.13 254.845 322.549 274.539 321.934 296.903C321.335 318.782 311.324 342.315 292.964 364.953C287.143 372.13 281.451 378.525 275.561 384.503C263.258 396.968 245.096 416.685 228.429 439.891C211.663 463.432 177.175 513.502 169.297 537.437ZM189.281 225.463C198.616 224.332 204.9 225.447 208.832 226.805C205.136 227.329 200.316 228.361 194.214 230.318C187.459 232.495 181.251 233.694 175.24 233.99C153.343 235.029 129.762 222.891 112.108 201.505C108.04 196.589 104.344 191.187 101.111 185.444C91.9421 169.194 92.7618 148.233 103.35 127.947L103.463 127.697C104.321 125.345 105.786 122.546 107.577 119.542C100.329 137.787 97.8849 157.451 108.351 173.966C119.895 192.181 133.648 206.512 148.137 215.395C161.737 223.74 175.566 227.132 189.281 225.463ZM216.148 16.4429C214.016 27.9438 195.694 61.6121 156.197 117.084C140.395 139.077 123.242 157.906 111.106 170.31C108.351 165.553 106.719 160.508 105.991 155.296C119.402 141.428 131.826 127.598 142.922 114.186C193.895 52.1595 210.881 27.0866 216.148 16.4429ZM149.617 211.322C145.647 208.826 141.731 205.912 137.906 202.59L138.05 202.43C142.308 197.825 146.968 192.796 151.954 187.462C168.849 169.422 182.67 150.168 193.038 130.216C212.649 92.0866 224.452 57.4548 226.091 35.2267C229.059 56.2637 224.133 90.8045 205.834 133.887C197.182 154.06 184.636 173.238 168.553 190.884L167.786 191.726C161.844 198.258 154.527 206.292 149.617 211.322ZM189.281 128.281C179.088 147.877 165.494 166.82 148.865 184.58C143.879 189.913 139.211 194.958 134.946 199.563L134.763 199.76C131.333 196.551 127.993 193.016 124.745 189.2C127.265 186.446 129.777 183.745 132.229 181.196C144.182 168.762 161.54 148.901 176.34 124.882C196.407 91.9728 217.348 51.7498 222.03 28.5507C222.6 46.7353 213.416 81.3518 189.281 128.281ZM218.767 22.0037C217.727 36.9792 204.065 71.3075 172.735 122.682C158.132 146.375 140.995 165.993 129.177 178.275C126.84 180.711 124.441 183.29 122.035 185.907C119.06 182.175 116.176 178.199 113.421 173.997C125.694 161.494 143.37 142.187 159.643 119.542C176.393 96.0011 210.889 45.9387 218.767 22.0037ZM139.666 111.492C129.367 123.942 117.899 136.763 105.558 149.644C105.406 141.891 107.008 133.895 109.672 126.043C115.364 120.209 120.927 114.413 126.217 108.807C187.641 43.4276 207.663 20.3954 213.803 11.618C211.185 19.5154 190.837 49.216 139.666 111.492ZM166.595 219.219C162.178 217.884 157.76 215.987 153.358 213.537C158.299 208.431 165.229 200.822 170.913 194.578L171.68 193.736C188.081 175.741 200.885 156.169 209.727 135.549C226.789 95.3942 232.026 64.1991 231.047 43.0028C235.813 62.4163 237.794 94.3473 222.402 139.509C215.283 160.258 203.792 179.671 188.241 197.196C182.966 203.151 177.236 209.053 171.217 214.743C169.631 216.245 168.105 217.732 166.595 219.219ZM212.338 7.67304C212.24 7.49855 212.187 7.33166 212.156 7.17993L212.354 6.99785C212.483 7.13441 212.627 7.27097 212.771 7.43028L212.338 7.67304ZM211.473 7.81718C207.807 13.6966 188.491 36.3495 123.136 105.924C120.108 109.133 116.981 112.418 113.793 115.726C117.527 107.532 122.119 99.726 126.749 92.7997C126.84 92.6707 136.031 79.9408 139.401 75.4041L211.473 7.81718ZM50.3579 163.543C33.4707 191.21 30.3286 225.341 42.9655 255.558C47.8609 267.256 54.7068 277.93 63.3212 287.276C84.3372 310.111 112.791 322.037 141.275 322.037C160.523 322.037 179.793 316.59 196.772 305.392C207.913 298.041 217.659 288.983 225.742 278.476C234.508 267.074 239.115 256.392 239.388 247.622C241.308 257.682 237.392 271.155 228.148 284.985C220.475 296.456 210.471 306.697 198.419 315.422C154.891 346.913 94.2267 340.715 57.2949 301.008C48.1645 291.198 40.9997 279.955 35.9981 267.605C21.8128 232.525 27.5887 193.167 50.3579 163.543ZM174.261 547.815C176.879 539.933 197.227 510.232 248.397 447.948C266.802 425.69 285.67 406.215 298.254 393.789C304.493 387.621 310.497 380.748 316.098 373.351C333.486 350.38 342.518 325.512 342.222 301.448C341.918 276.663 331.664 254.526 312.569 237.426C295.196 221.867 275.083 212.528 254.742 209.842C280.107 211.23 305.214 221.988 324.803 241.212C361.28 276.997 364.361 331.421 332.476 376.644C327.255 384.048 321.373 390.914 314.997 397.051C301.981 409.576 282.187 429.035 261.831 450.618C200.422 516.005 180.393 539.03 174.261 547.815ZM238.971 145.138C231.502 173.663 215.389 199.009 191.072 220.493L190.366 221.116C189.835 221.169 189.326 221.199 188.772 221.267C183.004 221.965 177.205 221.684 171.399 220.456C172.31 219.575 173.19 218.703 174.124 217.823C180.226 212.05 186.047 206.057 191.406 200.01C207.329 182.061 219.101 162.169 226.402 140.882C240.284 100.151 240.276 69.7902 236.679 49.4132C245.126 72.2254 249.923 103.307 238.971 145.138ZM48.1721 317.591C27.2851 295.341 16.3179 266.285 17.297 235.788C18.0635 211.678 26.2529 188.957 40.643 170.173C22.3745 199.646 18.7542 236.228 32.0894 269.175C37.2808 282.004 44.7263 293.679 54.2059 303.875C76.1555 327.476 106.181 339.683 136.335 339.683C158.899 339.683 181.532 332.848 200.901 318.828C213.363 309.808 223.708 299.202 231.662 287.314C240.048 274.781 244.284 262.658 244.155 252.478C245.718 260.921 244.314 271.208 239.859 282.148C232.459 296.752 218.296 313.798 198.745 331.672C151.734 365.477 87.7602 359.779 48.1721 317.591ZM149.085 414.302C156.546 385.785 172.667 360.432 196.984 338.947C198.479 337.627 199.944 336.307 201.386 334.994C202.601 334.114 203.815 333.227 205.007 332.294C222.896 318.373 236.512 301.334 243.646 284.044C243.654 284.029 243.669 284.007 243.676 283.991C243.745 283.862 243.79 283.726 243.828 283.589C244.109 282.899 244.397 282.216 244.655 281.526C250.226 266.679 250.431 252.956 245.422 242.888C253.498 248.123 258.363 254.731 259.888 262.643C263.691 282.292 247.798 309.603 213.94 341.617C207.838 347.391 202.024 353.384 196.658 359.43C180.742 377.38 168.963 397.271 161.662 418.558C147.56 459.934 147.788 490.621 151.56 510.998C143.795 490.272 137.648 458.015 149.085 414.302ZM334.738 403.325L176.591 551.623C180.264 545.744 199.572 523.091 264.928 453.516C285.223 431.994 304.956 412.588 317.942 400.101C324.515 393.774 330.571 386.703 335.945 379.086C351.625 356.843 359.602 330.852 358.395 305.901C357.151 280.039 346.563 256.627 327.778 238.2C310.838 221.578 289.989 210.753 267.47 206.891C265.292 206.519 263.114 206.231 260.943 205.996C290.285 207.187 318.936 219.538 339.892 241.864C383.009 287.792 380.694 360.227 334.738 403.325Z"
          fill="url(#paint0_linear_2713_1307)"
          {...logoAnimation}
        />

        <g clipPath="url(#clip1_2713_1307)">
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay: 0 }}
            d="M617.391 384.296H542.25L536 311.049H542.861L547.502 320.121C557.864 342.455 567.962 357.121 577.795 364.118C585.327 368.552 595.975 371.319 609.696 372.397C631.377 371.319 642.208 362.979 642.208 347.378C642.208 336.618 637.159 327.668 627.061 320.548C619.244 315.179 609.614 309.666 598.173 304.012C585.653 297.828 572.461 290.16 558.597 281.006C555.096 279.257 550.454 274.924 544.652 267.988C538.891 261.032 536 251.248 536 238.596C536 220.574 542.962 206.112 556.908 195.21C570.853 184.307 589.114 178.612 611.732 178.062H683.025L689.275 251.309H682.415L677.977 243.03C667.065 221.246 656.845 206.295 647.277 198.24C639.459 192.464 629.769 189.555 618.206 189.555C607.823 189.962 599.761 193.318 593.98 199.644C589.928 204.078 587.913 209.529 587.913 215.977C587.913 218.662 588.32 221.632 589.134 224.866C591.822 233.877 596.911 240.915 604.382 245.959C611.854 251.004 620.832 255.743 631.336 260.178C643.857 265.303 657.313 272.484 671.727 281.759C686.812 289.977 694.344 304.154 694.344 324.352C694.344 342.638 687.28 357.141 673.131 367.84C658.983 378.54 640.416 384.011 617.391 384.296Z"
            fill={black}
          />
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay: 0.15 }}
            d="M785.123 384.501H771.605C762.851 384.501 754.036 379.802 745.14 370.364C737.587 363.224 732.538 353.481 729.993 341.114C729.322 338.022 728.975 334.93 728.975 331.839C728.975 322.685 732.335 312.637 739.073 301.674C745.812 290.71 760.815 281.272 784.105 273.319C787.199 272.383 790.965 271.366 795.424 270.288C818.856 265.325 835.203 257.84 844.487 247.893C843.408 234.712 840.924 222.671 837.015 211.768C832.292 199.137 824.495 191.855 813.583 189.983C811.018 189.719 808.127 189.576 804.89 189.576C795.994 189.576 787.525 192.465 779.443 198.262C769.875 206.337 759.655 221.267 748.743 243.052L744.305 251.331H737.648L743.715 178.084H808.942C810.957 178.084 814.398 178.226 819.243 178.491C841.596 180.505 860.549 190.96 876.103 209.856C891.656 228.773 899.433 252.673 899.433 281.597L899.636 373.008H928.728V384.317H863.501C858.513 384.317 854.279 382.568 850.777 379.07C847.276 375.571 845.525 371.34 845.525 366.357V354.864C822.744 374.595 802.61 384.501 785.123 384.501ZM808.942 355.841C813.644 355.841 818.693 354.966 824.088 353.217C832.292 349.718 839.56 344.063 845.891 336.273V281.577C845.891 276.329 845.749 270.41 845.484 263.82L831.946 271.488C820.912 277.265 810.407 283.591 800.432 290.446C790.477 297.321 783.738 305.05 780.237 313.654C779.158 317.417 778.608 321.058 778.608 324.536C778.608 332.876 781.703 340.341 787.891 346.931C793.592 352.891 800.595 355.841 808.942 355.841Z"
            fill={black}
          />
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay: 0.3 }}
            d="M1039.38 383.686H1038.97C1020.12 383.564 1002.85 379.618 987.159 371.889C971.483 364.159 958.82 352.626 949.191 337.289C939.562 321.952 934.757 302.852 934.757 279.99C934.757 255.5 939.765 235.566 949.802 220.168C959.838 204.77 972.725 193.562 988.482 186.565C1003.02 179.975 1018.43 176.68 1034.74 176.68H1103.4L1109.65 249.926H1103C1101.79 248.035 1100.31 245.289 1098.56 241.648C1094.93 234.671 1090.45 226.758 1085.14 217.93C1079.83 209.123 1074.07 202.085 1067.88 196.858C1059.67 191.06 1049.7 188.172 1037.99 188.172H1035.16C1017.13 188.172 1004.2 198.729 996.381 219.842C990.986 234.101 988.299 250.048 988.299 267.663C988.299 272.24 988.502 276.878 988.909 281.597C993.083 320.61 1009.84 344.429 1039.19 353.033C1043.51 353.989 1048.42 354.457 1053.93 354.457C1059.45 354.457 1067.27 353.684 1077.36 352.138C1087.46 350.592 1098.03 343.9 1109.08 332.062L1108.27 335.886C1101.53 351.344 1092.76 363.183 1081.9 371.4C1071.05 379.577 1056.88 383.686 1039.38 383.686Z"
            fill={black}
          />
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay: 0.45 }}
            d="M1243.47 384.499H1131.17V372.987H1160.26V189.555H1131.17V178.062H1196.19C1201.18 178.062 1205.46 179.812 1209.02 183.31C1212.58 186.809 1214.37 191.121 1214.37 196.227V234.976C1219.89 224.765 1229.11 212.377 1242.04 197.834L1261.03 178.062H1314.15L1292.53 232.941L1282.84 232.535C1274.49 232.535 1264.19 233.409 1251.93 235.159C1239.68 236.908 1227.16 242.502 1214.37 251.899V372.966H1243.47V384.499Z"
            fill={black}
          />
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay: 0.6 }}
            d="M1420.27 384.5H1419.86C1401.15 384.357 1383.97 380.432 1368.36 372.702C1352.74 364.973 1340.12 353.46 1330.49 338.204C1320.86 322.929 1316.06 303.93 1316.06 281.19C1316.06 256.72 1320.86 236.908 1330.49 221.754C1340.12 206.621 1352.74 195.515 1368.36 188.457C1383.97 181.399 1401.21 177.859 1420.07 177.859H1421.47C1455.67 179.08 1478.29 198.912 1489.32 237.376C1494.03 254.32 1496.39 271.487 1496.39 288.838L1447.71 289.041C1420.25 289.306 1394.39 289.428 1370.17 289.428C1372.47 304.642 1378.05 318.291 1386.94 330.394C1399.06 346.931 1415.02 355.209 1434.8 355.209C1440.32 355.209 1448.14 354.436 1458.24 352.89C1468.33 351.344 1478.9 344.652 1489.95 332.814L1488.94 336.638C1482.34 352.097 1473.63 363.935 1462.78 372.153C1451.95 380.391 1437.78 384.5 1420.27 384.5ZM1400.68 277.345L1446.12 276.938V271.101C1446.12 263.168 1445.82 253.445 1445.21 241.932C1444.6 230.42 1442.74 219.497 1439.65 209.143C1435.62 196.491 1428.07 190.165 1417.03 190.165C1402.88 190.165 1390.91 198.973 1381.08 216.608C1372.73 231.538 1368.56 249.296 1368.56 269.88L1368.76 276.938C1378.19 277.203 1388.84 277.345 1400.68 277.345Z"
            fill={black}
          />
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay: 0.75 }}
            d="M1736.94 383.89H1615.76C1587.77 383.219 1565.38 373.353 1548.62 354.335C1531.87 335.296 1523.07 311.05 1522.26 281.597V279.99C1523.07 250.252 1532.01 225.843 1549.11 206.743C1566.21 187.644 1588.95 177.961 1617.37 177.697C1632.72 177.839 1644.77 179.996 1653.53 184.145L1653.33 94.1581H1624.25V82.625H1689.48C1694.45 82.625 1698.74 84.3743 1702.31 87.8729C1705.87 91.3715 1707.66 95.6837 1707.66 100.789V372.397H1736.94V383.89ZM1620 362.695C1637.91 362.695 1649.09 355.291 1653.53 340.503V221.043C1649.09 206.235 1639.05 198.851 1623.44 198.851C1619.27 198.851 1614.89 199.665 1610.31 201.272C1597.52 207.313 1588.2 218.948 1582.34 236.176C1576.47 253.384 1573.54 268.253 1573.54 280.763C1573.54 308.08 1576.6 328.563 1582.72 342.212C1588.87 355.881 1601.29 362.695 1620 362.695Z"
            fill={black}
          />
        </g>
        <motion.path d="M2008.44 5.57341L1974.7 146.639L2026.4 131.744L2083.35 5.57341H2008.44Z" {...purpleAnimation} />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2713_1307"
          x1="91.1443"
          y1="563.873"
          x2="290.911"
          y2="11.4634"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0223" stopColor="#EF646D" />
          <stop offset="0.5" stopColor="#92278F" />
          <stop offset="1" stopColor="#2484C6" />
        </linearGradient>
        <clipPath id="clip0_2713_1307">
          <rect width="2993" height="560" fill="white" />
        </clipPath>
        <clipPath id="clip1_2713_1307">
          <rect width="1200.94" height="301.875" fill="white" transform="translate(536 82.625)" />
        </clipPath>
      </defs>
    </motion.svg>
  )
}

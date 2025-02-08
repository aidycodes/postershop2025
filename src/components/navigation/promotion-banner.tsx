const PromotionBanner = ({promotion, showPromotion, code}: {promotion?: string, showPromotion?: boolean, code?: string}) => {
    if (!showPromotion) return null
    return (
        <div className="bg-blue-600 text-white text-center py-2">
            <p className="text-sm font-medium">{promotion} <span className="font-bold">{code}</span></p>
        </div>

    )
}

export default PromotionBanner

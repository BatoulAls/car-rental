const { Op } = require('sequelize');
const Car = require('../../models/Car');
const Feature = require('../../models/Feature');
const Tag = require('../../models/Tag');
const CarImage = require('../../models/CarImage');
const CarCategory = require('../../models/CarCategory');
const Region = require("../../models/Region");

exports.getMyCars = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Car.findAndCountAll({
            where: { vendor_id: vendorId },
            include: [
                {
                    model: Region,
                    as: 'region',
                    attributes: ['id', 'name_en', 'name_ar']
                },
                {
                    model: CarImage,
                    where: { is_main: true },
                    required: false,
                    attributes: ['image_url']
                },
                {
                    model: CarCategory,
                    attributes: ['name']
                },
                {
                    model: Feature,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'type_']
                },
                {
                    model: Tag,
                    as: 'Tags',
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
            cars: rows
        });

    } catch (err) {
        console.error('❌ getMyCars error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createCar = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const {
            name, brand, model, year, price_per_day, seats,
            no_of_doors, bags, transmission, engine_capacity,
            fuel_type, regional_spec, description, color,
            location, mileage_limit, additional_mileage_charge,
            insurance_included, deposit_amount, region_id,
            category_id, feature_ids, tag_ids
        } = req.body;

        const images = req.files; // multer attaches here

        // ✅ Validation
        if (!brand || !model || !year || !price_per_day || !region_id || !category_id) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        // ✅ Create tthe car
        const car = await Car.create({
            vendor_id: vendorId,
            name,
            brand,
            model,
            year,
            price_per_day,
            seats,
            no_of_doors,
            bags,
            transmission,
            engine_capacity,
            fuel_type,
            regional_spec,
            description,
            color,
            location,
            mileage_limit,
            additional_mileage_charge,
            insurance_included,
            deposit_amount,
            region_id,
            category_id,

        });

        // ✅ Attach features
        if (Array.isArray(feature_ids) && feature_ids.length > 0) {
            await car.setFeatures(feature_ids);
        }

        // ✅ Attach tags
        if (Array.isArray(tag_ids) && tag_ids.length > 0) {
            await car.setTags(tag_ids);
        }

        if (images && images.length > 0) {
            const mainImageUrl = `/uploads/${images[0].filename}`;

            const imagePromises = images.map((img, index) =>
                CarImage.create({
                    car_id: car.id,
                    image_url: `/uploads/${img.filename}`,
                    is_main: index === 0
                })
            );

            await Promise.all(imagePromises);

            //  Update main photo in Car table
            car.photo = mainImageUrl;
            await car.save();
        }

        res.status(201).json({ message: 'Car created successfully', car });

    } catch (err) {
        console.error('❌ createCar error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getMyCarDetails = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const carId = req.params.carId;

        const car = await Car.findOne({
            where: {
                id: carId,
                vendor_id: vendorId
            },
            include: [
                { model: Region, as: 'region', attributes: ['id', 'name_en', 'name_ar'] },
                { model: CarCategory, attributes: ['id', 'name'] },
                {
                    model: CarImage,
                    attributes: ['id', 'image_url', 'is_main']
                },
                {
                    model: Feature,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'type_']
                },
                {
                    model: Tag,
                    as: 'Tags',
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!car) return res.status(404).json({ error: 'Car not found or unauthorized' });

        res.json({ car });

    } catch (err) {
        console.error('❌ getMyCarDetails error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateMyCar = async (req, res) => {
    try {
        const carId = req.params.carId;
        const vendorId = req.user.id;
        const files = req.files;

        const {
            name,
            brand,
            model,
            year,
            price_per_day,
            seats,
            no_of_doors,
            bags,
            transmission,
            engine_capacity,
            regional_spec,
            fuel_type,
            color,
            location,
            mileage_limit,
            additional_mileage_charge,
            deposit_amount,
            category_id,
            region_id,
            description,
            availability_status,
            insurance_included,
            is_active,
            tagIds = [],
            featureIds = []
        } = req.body;

        const car = await Car.findOne({ where: { id: carId, vendor_id: vendorId } });
        if (!car) return res.status(404).json({ error: 'Car not found or unauthorized' });

        // ✅ Assign updated values
        Object.assign(car, {
            name,
            brand,
            model,
            year,
            price_per_day,
            seats,
            no_of_doors,
            bags,
            transmission,
            engine_capacity,
            regional_spec,
            fuel_type,
            color,
            location,
            mileage_limit,
            additional_mileage_charge,
            deposit_amount,
            category_id,
            region_id,
            description,
            availability_status,
            insurance_included,
            is_active
        });

        await car.save();

        // ✅ Tags and Features
        // 🔄 Clear and set new tags and features
        if (Array.isArray(tagIds)) {
            await car.setTags([]);          // clear old
            await car.setTags(tagIds);      // add new
        }

        if (Array.isArray(featureIds)) {
            await car.setFeatures([]);      // clear old
            await car.setFeatures(featureIds); // add new
        }


        // ✅ Replace Images if any
        if (files && files.length > 0) {
            const oldImages = await CarImage.findAll({ where: { car_id: car.id } });
            for (const img of oldImages) {
                await img.destroy();
            }

            const uploaded = await Promise.all(
                files.map((file, index) =>
                    CarImage.create({
                        car_id: car.id,
                        image_url: `/uploads/${file.filename}`,
                        is_main: index === 0
                    })
                )
            );

            // Update main image path in `car.photo`
            car.photo = uploaded[0]?.image_url || null;
            await car.save();
        }

        res.json({ message: 'Car updated successfully', car });

    } catch (err) {
        console.error('❌ updateCar error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateCarImages = async (req, res) => {
    try {
        const carId = req.params.carId;
        const vendorId = req.user.id;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Please upload at least one image.' });
        }

        // ✅ Verify car belongs to vendor
        const car = await Car.findOne({ where: { id: carId, vendor_id: vendorId } });
        if (!car) return res.status(404).json({ error: 'Car not found or unauthorized' });

        // ✅ Delete old images
        await CarImage.destroy({ where: { car_id: carId } });

        // ✅ Save new images
        const uploadedImages = await Promise.all(
            files.map((file, index) =>
                CarImage.create({
                    car_id: carId,
                    image_url: `/uploads/${file.filename}`,
                    is_main: index === 0 // first image = main image
                })
            )
        );

        // ✅ Update car photo (main image) field if exists
        car.photo = uploadedImages[0]?.image_url || null;
        await car.save();

        res.json({
            message: 'Car images updated successfully',
            images: uploadedImages
        });

    } catch (err) {
        console.error('❌ updateCarImages error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const carId = req.params.carId;
        const vendorId = req.user.id;

        const car = await Car.findOne({
            where: {
                id: carId,
                vendor_id: vendorId
            }
        });

        if (!car) {
            return res.status(404).json({ error: 'Car not found or unauthorized' });
        }

        // 1. ✅ Delete all images related to this car
        await CarImage.destroy({ where: { car_id: carId } });

        // 2. ✅ Remove all car-feature mapping
        await car.setFeatures([]); // removes entries from `car_feature_mapping`

        // 3. ✅ Remove all car-tag mapping
        await car.setTags([]); // removes entries from `car_tags`

        // 4. ✅ Soft delete the car
        await car.destroy();

        res.json({ message: 'Car and its related data deleted successfully' });

    } catch (error) {
        console.error('❌ deleteCar error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getCarFeatures = async (req ,res) => {
    try {
    const carId = req.params.carId;
        const features = await Feature.findAll(
            {
                attributes: ['id', 'name','type_'],
                include: [
                    {
                        model: Car,
                        attributes: [],
                        through : {attributes : []},
                        where : { id: carId }
                    }
                ]
            }
        )
        if(!features) return res.status(404).json({ error: 'Car not have features' });
        return res.status(201).json({features})
    }catch (err){
        console.error('❌ getCarFeatures error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.addCarFeatures = async (req,res) => {
    try{
        const {carId , featureId} = req.body;
        const car = await Car.findByPk(carId);
        if(!car) return res.status(404).json({ error: 'Car not found or unauthorized' });
        await car.addFeature(featureId);
        return res.status(201).json({message: 'Feature added to Car'});
    }catch (err){
        console.error('❌ addCarFeatures error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.removeFeatureFromCar = async (req ,res) => {
    try {
        const {carId, featureId} = req.params;
        const car = await Car.findByPk(carId);
        if (!car) return res.status(404).json({error: 'Car not found or unauthorized'});
        const hasFeature = car.hasFeature(featureId);
        if(!hasFeature) res.status(400).json({ message: 'Feature not associated with this car' });
        await car.removeFeature(featureId);
        res.status(201).json({message: 'Feature removed successfully'});
    }catch (err){
        console.error('❌ removeFeatureFromCar error:', err);
         res.status(500).json({ error: 'Server error' });
    }
}
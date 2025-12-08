<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class DynamicGeoJSONModel extends Model
{
    protected $connection = 'mongodb';
    protected $fillable = ['type', 'data'];
    public $timestamps = true;
    public function setCollectionName($name)
    {
        $this->collection = $name;
    }
    /**
     * Gets the name of the MongoDB collection associated with the model.
     *
     * @return string The name of the collection.
     */
    public function getCollectionName()
    {
        return $this->collection;
    }
}

<?php

function json_to_xml($json, $isRoot = true){
    $obj = json_decode($json);
    $isArray = is_array($obj);
    $obj = !$isArray ? get_object_vars($obj) : $obj;

    $result = $isRoot ? '<root>' : '';
    foreach($obj as $key => $value){
        $isValueAreferenceType = in_array(gettype($value), ['object','array']);

        if($isArray){
            $result .= "<element>"
                    . ($isValueAreferenceType
                        ? json_to_xml(json_encode($value), false)
                        : $value)
                    . "</element>";
        }else{
            $result .= "<$key>"
                    . ($isValueAreferenceType
                        ? json_to_xml(json_encode($value), false)
                        : $value)
                    . "</$key>";
        }
    }
    $result .= $isRoot ? '</root>' : '';
    return $result;
}

$json = '{"name": "Dan", "age": 32, "notes": ["Hey", "How", "Are", "You", "?", {"sentence": "Hello how are you?", "Question": true}], "info": {"DOB": "07081988", "friends": [5,12,4454,124,124,1246,88]}}';

$json = '[
    "age",
    23,
    {"name": "jonas"},
    {"code" : 234},
    [2, 5, 7, {"sound": "high", "obj": {"arr": ["k", "l", "o"]}}]
]';
echo json_to_xml($json);
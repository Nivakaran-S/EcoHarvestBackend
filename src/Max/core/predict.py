import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import cv2
import os


class ImageClassifier():
    def __init__(self, model_path, class_name=None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = models.efficientnet_b0(pretrained=False)
        self.model.classifier[1] = nn.Linear(in_features=1280, out_features=101)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()


        if class_name is None:
            self.class_name = {0: 'Cat', 1: 'Dog', 2: 'person'}
        else:
            self.class_name = class_name
        

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                std=[0.229, 0.224, 0.225])
        ])


    def predict(self, image_path):
        image = Image.open(image_path).convert("RGB")
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(image_tensor)
            # [[0.3, 0.7, 0.9]]
            predicted_class = torch.argmax(outputs, dim=1)
        
        

        label = self.class_name[predicted_class.item()]

        img = cv2.imread(image_path)
        
        cv2.putText(img, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        output_path = "labeled_image.jpg"
        cv2.imwrite(output_path, img)
        cwd = os.getcwd()
        output_path = os.path.join(cwd, output_path)

        return label, output_path
        
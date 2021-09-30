import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
# from models.sa_gan_l2h_unet import InpaintRUNNet, InpaintSADirciminator
from models.sa_gan import InpaintSANet, InpaintSADirciminator
from models.loss import SNDisLoss, SNGenLoss, ReconLoss, PerceptualLoss, StyleLoss
# from util.logger import TensorBoardLogger
from util.config import Config
from data.inpaint_dataset import InpaintDataset
from util.evaluation import AverageMeter
from util.util import load_consistent_state_dict
from models.vgg import vgg16_bn

from evaluation import metrics
from PIL import Image
import pickle as pkl
import numpy as np
import logging
import time
import sys
import os
from skimage.transform import rescale



# python train inpaint.yml
config = Config(sys.argv[1])
logger = logging.getLogger(__name__)
time_stamp = time.strftime('%Y%m%d%H%M', time.localtime(time.time()))
log_dir = 'model_logs/test_{}_{}'.format(time_stamp, config.LOG_DIR)
result_dir = 'result_logs/BTP'
# tensorboardlogger = TensorBoardLogger(log_dir)
cuda0 = torch.device('cuda:{}'.format(config.GPU_IDS[0]))
cuda1 = torch.device('cuda:{}'.format(config.GPU_IDS[0]))
cpu0 = torch.device('cpu')
TRAIN_SIZES = ((64, 64), (128, 128), (256, 256))
SIZES_TAGS = ("64x64", "128x128", "256x256")


def read_val_mask(path):
    mask = Image.open(path)
    rgb = np.asarray(mask)
    res = (0.2126*rgb[:, :, 0]+0.7152*rgb[:, :, 1] +
               0.0722*rgb[:, :, 2]).astype(np.uint8)
    img = transforms.ToPILImage()(res)
    return img

def logger_init():
    """
    Initialize the logger to some file.
    """
    logging.basicConfig(level=logging.INFO)

    logfile = 'logs/{}_{}.log'.format(time_stamp, config.LOG_DIR)
    fh = logging.FileHandler(logfile, mode='w')
    formatter = logging.Formatter(
        "%(asctime)s - %(filename)s[line:%(lineno)d] - %(levelname)s: %(message)s")
    fh.setFormatter(formatter)
    logger.addHandler(fh)


def img2photo(imgs):
    return ((imgs + 1) * 127.5).transpose(1, 2).transpose(2, 3).detach().cpu().numpy()


def main():
    logger_init()

    logger.info("Initialize the dataset...")

    tensor = transforms.ToTensor()
    img = tensor(Image.open('image.png').convert("RGB"))
    mask = read_val_mask('mask.png')
    mask = tensor(mask)[:1, :, :]

    img = F.interpolate(torch.unsqueeze(img*255, 0), (256, 256))
    mask = F.interpolate(torch.unsqueeze(mask, 0), (256, 256))

    img = img[0]
    mask = mask[0]

    whole_model_path = 'model_logs/epoch_60_ckpt.pth.tar'
    nets = torch.load(whole_model_path)
    netG_state_dict, netD_state_dict = nets['netG_state_dict'], nets['netD_state_dict']

    netG = InpaintSANet()
    netD = InpaintSADirciminator()

    netG.load_state_dict(netG_state_dict)

    netG.eval()
    netD.eval()

    netG.train()
    netD.train()

    img = (img / 127.5 - 1)
    recon_imgs, refine = netG(img, mask)
    complete_imgs = refine * mask + img * (1 - mask)

    gen_img = img2photo(recon_imgs)
    comp_img = img2photo(complete_imgs)

    gen_img = Image.fromarray(gen_img[0].astype(np.uint8))
    comp_img = Image.fromarray(comp_img[0].astype(np.uint8))
    comp_img.save('../media/output.png')


if __name__ == '__main__':
    main()
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'angular-custom-modal';
import { NewApiCloudService } from '../../cfServices/new-api-cloud.service';
import Swal from 'sweetalert2';
import { AwbService } from '../../cfServices/awb.service';
import { MasterService } from '../../services/master-service.service';

@Component({
  selector: 'app-sales-quotation',
  templateUrl: './sales-quotation.component.html',
  styleUrls: ['./sales-quotation.component.css']
})
export class SalesQuotationComponent implements OnInit {
    valForm: FormGroup;
@ViewChild('SendCollectionMAil') SendCollectionMAil:any;
@ViewChild('SendCollectionMAilnew') SendCollectionMAilnew:any;

  constructor(public fb: FormBuilder,public serviceNew:NewApiCloudService,private bill_ser: AwbService,private service:MasterService,) {
     this.valForm = fb.group({
            'name': [null, Validators.required],
            'mail': [null, Validators.email],
            'country_code':['+44',Validators.required],
            'contact': [null, Validators.required],
            'location': [null, Validators.required],
            'user_id': [null, Validators.required]
          })
  }
  InitialCapitalize(data) {
    if (!data) return data; // Handle null, undefined, or empty string

    let value= data
        .split(' ') // Split string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join(' '); // Join words back into a string
  this.valForm.get('name').setValue(value); // Set the converted value back to the form control

}

    ngOnInit() {
        this.user_data= JSON.parse(localStorage.getItem("log_data"))
    this.user_id=this.user_data.v_user_id;
    this.valForm.controls['user_id'].setValue(this.user_id)
        this.getEnquiry();
        this.getEmployee()
    }

   

    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }
      name:any
  mail:any
  contact:any
  location:any
  user_id: any;
  user_data: any;
  enquiryList: any;
  // valForm: FormGroup;
  btn3=false
employees:any;
fromDate=new Date().toISOString().split('T')[0];
toDate=new Date().toISOString().split('T')[0];
  getEnquiry()
  {
    this.btn3=true
    this.serviceNew.v1_ds_order_enquiry_get(this.fromDate,this.toDate).subscribe(res=>{
      this.enquiryList = res['data']
      this.btn3=false;
    })
  }
   getEmployee() {
    this.bill_ser.getemployeeBasedOnBranch(this.user_data.v_point_id).subscribe(data => {
      this.employees = data['data'];
      // this.allUsers = data['data']
    })
  }

  submit()
  {
if (String(this.valForm.value.contact).length != 10) {
  this.showMessage("Invalid phone number. It should be exactly 10 digits.",'error');
  return;
}

    if(this.valForm.valid)
    {
      this.valForm.get('contact').setValue(String(this.valForm.value.country_code)+this.valForm.value.contact)
      this.service.v1_ds_order_enquiry_insert(this.valForm.value).subscribe(res=>{
        if(res['data']=200)
        {
           this.serviceNew.sendSalesQuotationToCust  (this.valForm.value.name,this.valForm.value.mail,this.valForm.value.location).subscribe(res=>{})
          this.getEnquiry()
          this.valForm.reset();
          this.SendCollectionMAil.close()
          this.valForm.get('country_code').setValue('+44')
          this.valForm.controls['user_id'].setValue(this.user_id)
          this.showMessage('Enquiry Added!')
        }
      })
    }
    else
    {
      this.showMessage('Please fill all details!','error')
    }
  }
  
  sendMail(data)
  {
    this.serviceNew.sendSalesQuotationToCust (data.shipper_name,data.email,data.employee_name).subscribe(res=>{
      this.showMessage("Mail Send Successfully")
    },(error=>{
            this.showMessage("Failed",'error')

    })
    )
  }

emailContent:any;
viewMail(data){
  this.emailContent=`
   <p>Dear ${data.shipper_name},</p>
  <p>We thank you for choosing Cargo Force for your shipping needs from the United Kingdom to India. We are committed to
    providing a seamless and efficient shipping experience. Our service is a complete door-to-door solution, inclusive
    of all charges, unless you have specific requirements. Below is your quotation, along with an overview of our
    shipping process, designed to be clear and straightforward.</p>
  <h4>📝 Quotation Summary</h4>
  <ul>
    <li>📦 Shipping Rate: £4 per kg</li>
    <li>💰 Minimum Billing: 10 kg at £40</li>
    <li>🚚 Pick-Up: Included in price across the UK Mainland</li>
    <li>🔍 Additional Charges: £15 per parcel for pick-ups from:
      <ul>
        <li><a href='https://en.wikipedia.org/wiki/GY_postcode_area'>Channel Islands - Guernsey</a></li>
        <li><a href='https://en.wikipedia.org/wiki/JE_postcode_area'>Channel Islands - Jersey</a></li>
        <li><a href='https://upload.wikimedia.org/wikipedia/commons/1/12/BT_postcode_area_map.svg'>Northern Ireland</a>
        </li>
        <li>Offshore Isles</li>
        <li><a href='https://en.wikipedia.org/wiki/IV_postcode_area'>Scottish Highlands</a></li>

      </ul>
    </li>
    <li>✅ Inclusive: Customs Duty + Taxes in India & Handling Fees</li>
    <li>🎁 Additional Services: Included packing boxes and tapes at our warehouse
      <ul>
        <li>Packaging Materials: Included in price packaging materials like boxes, tapes, gunny bags, shrink wraps, and
          bubble chips are available at our North Wembley warehouse in London. Note: These materials are for use at the
          warehouse only and are not shipped to pick-up addresses.</li>
      </ul>
    </li>
  </ul>
  <h4>⚖️ Understanding Chargeable Weight</h4>
  <p>Our pricing is based on the greater of the actual weight or volumetric weight of your shipment.</p>
  <ul>
    <li><b>Actual Weight: </b>The weight of your package on the scale.</li>
    <li><b>📐 Volumetric Weight:</b> Calculated as (Length ✖ Width ✖ Height in cm) ÷ 5000.</li>
  </ul>
  <h4>🌟 Examples:</h4>
  <ul>
    <li><b>Example 1: </b> Actual Weight: 10 kg, Dimensions: 50 × 30 × 20 cm, Volumetric Weight: 6 kg, Chargeable
      Weight: 10 kg</li>
    <li><b>Example 2:</b> Actual Weight: 10 kg, Dimensions: 50 × 60 × 40 cm, Volumetric Weight: 24 kg, Chargeable
      Weight: 24 kg</li>
  </ul>
  <p><b>Rounding of Chargeable Weight: </b>We always round up to the next whole kilogram. For instance, if your
    chargeable weight is 16.13 kg, it will be rounded up to 17 kg.</p>
  <h4>🚢 Our Shipping Process</h4>
  <ol>
    <li><b>🤝 Initial Consultation:</b> Discuss your shipping requirements to provide an accurate price estimate.</li>
    <li><b>📝 Booking Form:</b> Complete our online form with your shipment details. <a
        href='https://api.cargoforce.com/#/login'>Form Link</a></li>
    <li><b>💰 Deposit Payment:</b> Before scheduling the pick-up, we require a minimum deposit of £50 or £10 per box
      (whichever is higher). <br>
      For example, if you have 6 boxes, the deposit is £60 (6 × £10), which exceeds the minimum £50. <br>This deposit
      will be adjusted in the final invoice.
    </li>
    <li><b>🚚 Pick-Up Arrangement:</b> We collect your package from your specified UK address.
    </li>
    <li><b>🏢 Warehouse Processing:</b> Verification of package weight and dimensions at our Wembley, London warehouse.
    </li>
    <li><b>💳 Invoice and Payment:</b> Final invoice based on confirmed weight and size, with payment instructions.
    </li>
    <li><b>✈️ Shipment Dispatch: </b>Your package begins its journey to India, typically within 14 workdays to Metro
      cities and 21 workdays to remote areas of India.
    </li>
  </ol>
  <h4>💳 Payment Information</h4>
  <ul>
    <li><b>🏦 Mode of Payment: </b>Bank transfer in the UK or India (before dispatch).</li>
    <li><b>💸 UPI Interface:</b> Google Pay for payments in India.</li>
    <li><b>💡 GST (India Only):</b> For any payments made in India, an 18% GST will be applicable. <br> For example, if
      the amount in GBP is £100, you would add £18 as GST for a total of £118.
      Then, when making the payment in INR, simply use Google to convert £118 to current INR rate at the time of making
      the payment.
    </li>
  </ul>

  <p><b>🚫 Note:</b> We do not accept cash or cards in UK or India.</p>
  <h4>🚨 Non-Compatible Surcharge</h4>
  <ul>
    <li><b>📦 Non-Compatible Surcharge:</b> £15 per parcel for items like suitcases, bags, trolley bags, boxes which are
      shrink-wrapped, etc which are incompatible with our automated sortation equipment.
    </li>
    <li><b>💡 Our Strong Recommendation:</b>
      <p>We understand that you may sometimes need to send items such as suitcases, bags, trolley bags, or
        shrink-wrapped boxes. However, most carriers (DHL, DPD, FedEx, and other local couriers) discourage collecting
        these items because they require additional manual handling and are prone to losing shipping labels — in fact,
        our current label loss rate has increased to around 60–70%. This can result in lost or delayed parcels.</p>

      <p>To avoid these issues, we strongly recommend transferring the contents into standard cardboard boxes. This
        helps prevent label damage, reduces manual handling, and avoids extra surcharges.</p>

      <p>If you still need to send suitcases or other non-boxed items, you can drop them off directly at our warehouse
        to minimize the risk of label loss and any associated surcharges. Alternatively, you may arrange a same-day
        collection through a mini-cab service or similar, which will pick up the items from your door and deliver them
        directly to us.<b> Please note that this third-party service is not included</b> in our shipping price and costs
        will
        vary depending on the number of packages and the distance. Any fees associated with this option would be your
        responsibility.

      </p>
    </li>
  </ul>
  <h4>🚨 Locked Item Surcharge</h4>
  <ul>
    <li><b>🔒 Locked Item Surcharge:</b> £25 per parcel for any suitcases, bags, or boxes that are sent in a locked
      condition. This fee covers the cost of a professional lock cutting service.</li>
    <li><b>🚫 Policy:</b> We do not accept any suitcases, bags, or boxes that are locked. Please ensure all items are
      unlocked before shipping to avoid this surcharge.
    </li>
  </ul>
  <h4>📦 What Can Be Sent</h4>
  <ul>
    <li><b>👕 Clothing and Accessories:</b> Tops, sweaters, jeans, jackets, etc.</li>
    <li><b>👟 Footwear:</b> Various types of shoes.</li>
    <li><b>📚 Reading Material:</b> Books.</li>
    <li><b>🍴 Kitchen and Household Items:</b> Kitchenware, utensils, glassware.</li>
    <li><b>👜 Personal Items and Accessories:</b> Handbags, scarves, caps, stationery, toiletries.</li>
    <li><b>🍫 Sweets and Snacks:</b> Chocolates, snacks, food supplements.</li>
    <li><b>🔌 Electronics:</b> Smartphone charger, kettle, hair straightener, blender, etc.</li>
  </ul>

  <p><b>ℹ️ Note:</b> This is a consolidated list. For the most current information, it's always best to consult with us
    before booking.
  </p>
  <h4>🚫 Prohibited & Restricted Items</h4>
  <ul>
    <li><b>☠️ Hazardous Materials:</b> Perfumes, deodorants, explosives, etc.</li>
    <li><b>🔫 Weapons and Electronics:</b> Mobile phones with battery, iPads, laptops, firearms, drones, etc.</li>
    <li><b>🚫 Illegal Goods and Currency:</b> Narcotic drugs, e-cigarettes, counterfeit goods, etc.</li>
    <li><b>🌍 Geopolitical and Cultural:</b> Incorrect maps and literature, goods made in Pakistan, antiquities.</li>
    <li><b>🐾 Animal and Plant Products:</b> Endangered species, live animals, plants, etc.</li>
    <li><b>💰 Precious Metals and Currency:</b> Gold and silver (other than ornaments), excess currency.</li>
    <li><b>🔞 Miscellaneous:</b> High-value brands like Gucci, Louis Vuitton, tools, pornographic material, goods for
      commercial purposes, etc.</li>
  </ul>

  <p><b>ℹ️ Note:</b> This is a consolidated list. For the most current information, it's always best to consult with us
    before booking.
  </p>
  <h4>🔒 Package Safety and Liability</h4>
  <ul>
    <li><b>📸 Pre-Delivery Photos:</b> Request photos of your reinforced package from us.</li>
    <li><b>🔍 Delivery Inspection:</b> Check and photograph the package upon delivery before opening it. Do not open
      before documenting.
    </li>
    <li><b>💼 Liability:</b> Maximum liability is $50 per package/box for lost or undeliverable shipments. No insurance,
      no compensation, and no liability for in-transit damage.
    </li>
  </ul>
  <p><b>Important Note:</b> This service is not suitable for fragile items or those prone to breakage. Even with bubble
    wrap, we cannot guarantee protection against breakage. Cargo Force provides two layers of outer protection, but this
    does not ensure the safety of items inside the package. Cargo Force will combine/join multiple pieces of a shipment
    to add additional protection layers at no extra cost, provided they have been received in their original condition
    at our warehouse without changing any box or packing type. Please be aware that there is no compensation for damage,
    and Cargo Force cannot be held liable in any way for any damage incurred during transit. Sending fragile items or
    those prone to breakage is done at your own risk.

  </p>
  <h4>📦 Important Shipping Guidelines 🚚</h4>
  <p><b>ℹ️ Note:</b> Before sending your items through Cargo Force, please take note of the following important
    guidelines to ensure a smooth shipping experience:
  </p>
  <ul>
    <li>📏 Size Limitations: The maximum dimensions for pick-up items are 80 cm in height, width, and length. If your
      item exceeds these dimensions, a Long Length Charge of £60 per parcel will apply. However, this charge will not
      apply if the customer drops the item at our warehouse or sends it to us directly.
    </li>
    <li>⚖️ Weight Limit: Each piece must not exceed 30 kg in weight due to health and safety regulations. Items over 30
      kg will incur a Heavy Weight Surcharge of £60. However, this charge will not apply if the customer drops the item
      at our warehouse or sends it to us directly.
    </li>
    <li>🚚 Pick-Up Services: Our pick-ups are carried out through DHL, Fedex, DPD, Parcel Force and UPS their terms and
      conditions apply from your doorstep to our warehouse.
    </li>
  </ul>
  <h4>👣 Next Steps</h4>
  <ol>
    <li><b>🔎 Review the Quotation:</b> Ensure it aligns with your requirements.</li>
    <li><b>📝 Fill Out the Booking Form:</b> Using the provided link. <a href='https://api.cargoforce.com/#/login'>Form
        Link</a></li>
    <li><b>⏳ Await Confirmation:</b> We'll confirm and schedule the pick-up after deposit receipt.
    </li>
  </ol>
  <p>We hope this updated quotation meets your expectations. For any queries or further assistance, please feel free to
    contact us. We look forward to facilitating your shipping needs.

  </p>
  <p>Best regards,</p>
  <p> ${data.employee_name} <br>Senior Sales Executive <br>Cargo Force <br>Warehouse Address: <a
      href='https://www.google.com/maps/place/Cargo+Force/@51.564716,-0.2986398,15z/data=!4m6!3m5!1s0x4876138b83e1a9cb:0x290760fa2f17182e!8m2!3d51.5647082!4d-0.2986008!16s%2Fg%2F11sz5h4ysn?entry=ttu&g_ep=EgoyMDI1MDYwNC4wIKXMDSoASAFQAw%3D%3D'>Unit
      K, 9, Osram Rd, East Lane
      Business Park, Wembley HA9 7NG, United Kingdom <br>UK: <a href='tel:+442033846470'>+44 2033 846470 <br>India: <a
          href='tel:+912249110110'>+91 2249 110110</a>

      </a>
    </a>

  </p>
  
  
  `
  this.SendCollectionMAilnew.open()
}

}

<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service' => ['required', 'string'],
            'budget' => ['required', 'string'],
            'timeline' => ['required', 'string'],
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['required', 'regex:/^[0-9+\s-]{7,20}$/'],
            'details' => ['required', 'string', 'min:10', 'max:3000'],
        ];
    }

    public function messages(): array
    {
        return [
            'service.required' => 'يرجى اختيار نوع الخدمة المطلوبة.',
            'budget.required' => 'يرجى تحديد الميزانية المتوقعة.',
            'timeline.required' => 'يرجى تحديد الجدول الزمني المناسب.',
            'name.required' => 'الاسم مطلوب ولا يقل عن حرفين.',
            'email.required' => 'الرجاء إدخال بريد إلكتروني صحيح.',
            'phone.required' => 'رقم الهاتف مطلوب.',
            'phone.regex' => 'رقم الهاتف غير صحيح (7 إلى 20 رقماً).',
            'details.required' => 'يرجى كتابة تفاصيل ونبذة عن المشروع.',
        ];
    }
}
